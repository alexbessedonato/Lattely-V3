import sharp from "sharp";
import { afterAll, beforeEach, expect, test, vi } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { getMember } from "@/lib/auth/auth-server";
import { deletePhoto, uploadPhoto } from "@/lib/photo/photo-bucket";
import { submitShopAction } from "@/lib/submission/submit-shop-action";
import { submitShop } from "@/lib/submission/submit-shop";

// Tests can't sign in, so a fake getMember says who is "signed in".
vi.mock("@/lib/auth/auth-server", () => ({ getMember: vi.fn() }));
// The real redirect() only works inside a request; this one throws so a test can see where it went.
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`redirected to ${url}`);
  }),
}));
// Tests don't touch the real bucket; the fakes act as if they did.
vi.mock("@/lib/photo/photo-bucket", () => ({
  uploadPhoto: vi.fn(async () => "shops/fake.webp"),
  deletePhoto: vi.fn(),
}));

const member = { id: "member-1" };
const empty = {
  values: { name: "", address: "", instagramOrWebsite: "" },
  errors: {},
};

beforeEach(async () => {
  vi.clearAllMocks();
  vi.mocked(getMember).mockResolvedValue(member as never);
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

function form(photo?: File) {
  const formData = new FormData();
  formData.set("name", "Nomad");
  formData.set("address", "Carrer 1");
  formData.set("instagramOrWebsite", "");
  // With no photo chosen, the browser still sends an empty file.
  formData.set("photo", photo ?? new File([], ""));
  return formData;
}

async function png() {
  const bytes = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "#fff" },
  })
    .png()
    .toBuffer();
  return new File([bytes], "shop.png", { type: "image/png" });
}

test("a Submission without a photo is saved with no photo key", async () => {
  await expect(submitShopAction(empty, form())).rejects.toThrow(
    "redirected to /my-submissions?submitted=1",
  );

  expect(await db.select().from(shops)).toMatchObject([{ photoKey: null }]);
  expect(uploadPhoto).not.toHaveBeenCalled();
});

test("a Submission with a photo stores the uploaded photo's key", async () => {
  await expect(submitShopAction(empty, form(await png()))).rejects.toThrow(
    "redirected to /my-submissions?submitted=1",
  );

  expect(await db.select().from(shops)).toMatchObject([
    { name: "Nomad", photoKey: "shops/fake.webp" },
  ]);
});

test("a photo that isn't an image is refused, and nothing is saved or uploaded", async () => {
  const state = await submitShopAction(
    empty,
    form(new File(["hello"], "notes.txt")),
  );

  expect(state.errors.photo).toEqual([
    "That file isn't a photo. Try a JPEG, PNG or WebP.",
  ]);
  expect(state.values.name).toBe("Nomad"); // kept, so the Member doesn't retype it
  expect(await db.select().from(shops)).toHaveLength(0);
  expect(uploadPhoto).not.toHaveBeenCalled();
});

test("a refused Submission deletes the photo it just uploaded", async () => {
  for (const name of ["A", "B", "C"]) {
    await submitShop(member, {
      name,
      address: "Carrer 1",
      instagramOrWebsite: null,
    });
  }

  const state = await submitShopAction(empty, form(await png()));

  expect(state.errors.form?.[0]).toMatch(/already have 3/);
  expect(deletePhoto).toHaveBeenCalledWith("shops/fake.webp");
});
