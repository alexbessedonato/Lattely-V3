import { eq } from "drizzle-orm";
import sharp from "sharp";
import { afterAll, beforeEach, expect, test, vi } from "vitest";
import { db } from "@/db/client";
import { admins, ratings, shops } from "@/db/schema";
import { approveSubmissionAction } from "@/lib/admin/approve-submission-action";
import { closeShopAction } from "@/lib/admin/close-shop-action";
import { rejectSubmissionAction } from "@/lib/admin/reject-submission-action";
import { getMember } from "@/lib/auth/auth-server";
import { uploadPhoto } from "@/lib/photo/upload-photo";

// Tests can't sign in, so we replace getMember with a fake and choose who is "signed in" in each test.
vi.mock("@/lib/auth/auth-server", () => ({ getMember: vi.fn() }));
// refresh() only works inside a real request; here it does nothing.
vi.mock("next/cache", () => ({ refresh: vi.fn() }));
// Tests don't upload to the real bucket; the fake hands back a key as if it had.
vi.mock("@/lib/photo/upload-photo", () => ({
  uploadPhoto: vi.fn(async () => "shops/fake.webp"),
}));

function signInAs(member: { id: string } | null) {
  vi.mocked(getMember).mockResolvedValue(member as never);
}

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
  await db.delete(admins);
  await db.insert(admins).values({ memberId: "admin-1" });
});

afterAll(() => db.$client.end());

async function addShop(status: "pending" | "live") {
  const [shop] = await db
    .insert(shops)
    .values({ name: status, slug: status, address: "Carrer 1", status })
    .returning({ id: shops.id });
  return shop.id;
}

async function statusOf(id: number) {
  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  return shop.status;
}

function coordinates(text: string) {
  const formData = new FormData();
  formData.set("coordinates", text);
  return formData;
}

for (const [who, member] of [
  ["a Visitor who isn't signed in", null],
  ["a Member who isn't an Admin", { id: "member-1" }],
] as const) {
  test(`${who} is refused by every admin action, and nothing changes`, async () => {
    signInAs(member);
    const pending = await addShop("pending");
    const live = await addShop("live");

    await expect(
      approveSubmissionAction(
        pending,
        { coordinates: "" },
        coordinates("41.38, 2.17"),
      ),
    ).rejects.toThrow("Only Admins");
    await expect(rejectSubmissionAction(pending)).rejects.toThrow(
      "Only Admins",
    );
    await expect(closeShopAction(live)).rejects.toThrow("Only Admins");

    expect(await statusOf(pending)).toBe("pending");
    expect(await statusOf(live)).toBe("live");
  });
}

// Proves the fake sign-in really works, so the refusals above aren't passing by accident.
test("an Admin gets through every admin action", async () => {
  signInAs({ id: "admin-1" });
  const toApprove = await addShop("pending");
  const live = await addShop("live");

  await approveSubmissionAction(
    toApprove,
    { coordinates: "" },
    coordinates("41.38, 2.17"),
  );
  await closeShopAction(live);

  expect(await statusOf(toApprove)).toBe("live");
  expect(await statusOf(live)).toBe("closed");
});

test("an Admin approving with a photo stores the uploaded photo's key", async () => {
  signInAs({ id: "admin-1" });
  const id = await addShop("pending");
  const formData = coordinates("41.38, 2.17");
  const png = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "#fff" },
  })
    .png()
    .toBuffer();
  formData.set("photo", new File([png], "shop.png", { type: "image/png" }));

  await approveSubmissionAction(id, { coordinates: "" }, formData);

  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  expect(shop).toMatchObject({ status: "live", photoKey: "shops/fake.webp" });
});

test("a photo that isn't an image is refused, and the Submission stays pending", async () => {
  signInAs({ id: "admin-1" });
  const id = await addShop("pending");
  const formData = coordinates("41.38, 2.17");
  formData.set("photo", new File(["hello"], "notes.txt"));

  const state = await approveSubmissionAction(
    id,
    { coordinates: "" },
    formData,
  );

  expect(state.photoError).toBe(
    "That file isn't a photo. Try a JPEG, PNG or WebP.",
  );
  expect(state.coordinates).toBe("41.38, 2.17"); // kept, so the Admin doesn't retype them
  expect(await statusOf(id)).toBe("pending");
  expect(uploadPhoto).not.toHaveBeenCalled();
});
