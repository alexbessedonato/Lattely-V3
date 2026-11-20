import { eq } from "drizzle-orm";
import { afterAll, beforeEach, expect, test, vi } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import {
  approveSubmission,
  getPendingSubmissions,
  rejectSubmission,
} from "@/lib/admin/submissions";
import { deletePhoto } from "@/lib/photo/photo-bucket";

// Tests don't touch the real bucket: we only check which photos were asked to be deleted.
vi.mock("@/lib/photo/photo-bucket", () => ({ deletePhoto: vi.fn() }));

beforeEach(async () => {
  vi.mocked(deletePhoto).mockClear();
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

async function addShop(
  name: string,
  status: "pending" | "live" | "rejected",
  photoKey: string | null = null,
) {
  const [shop] = await db
    .insert(shops)
    .values({ name, slug: name, address: "Carrer 1", status, photoKey })
    .returning({ id: shops.id });
  return shop.id;
}

async function findShop(id: number) {
  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  return shop;
}

test("only pending Shops are listed for an Admin, oldest first", async () => {
  await addShop("first", "pending");
  await addShop("live", "live");
  await addShop("second", "pending");

  const pendingSubmissions = await getPendingSubmissions();
  expect(pendingSubmissions.map((shop) => shop.name)).toEqual([
    "first",
    "second",
  ]);
});

test("approving makes the Shop live at the given point", async () => {
  const id = await addShop("nomad", "pending");

  await approveSubmission(id, { x: 2.17, y: 41.38 });

  expect(await findShop(id)).toMatchObject({
    status: "live",
    location: { x: 2.17, y: 41.38 },
  });
});

test("rejecting marks the Shop rejected", async () => {
  const id = await addShop("nomad", "pending");

  await rejectSubmission(id);

  expect(await findShop(id)).toMatchObject({ status: "rejected" });
});

test("a Shop that isn't pending anymore can't be approved or rejected", async () => {
  const rejected = await addShop("rejected", "rejected");
  const live = await addShop("live", "live");

  await approveSubmission(rejected, { x: 2.17, y: 41.38 });
  await rejectSubmission(live);

  expect(await findShop(rejected)).toMatchObject({
    status: "rejected",
    location: null,
  });
  expect(await findShop(live)).toMatchObject({ status: "live" });
});

test("approving keeps the Member's photo", async () => {
  const id = await addShop("nomad", "pending", "shops/abc.webp");

  await approveSubmission(id, { x: 2.17, y: 41.38 });

  expect(await findShop(id)).toMatchObject({ photoKey: "shops/abc.webp" });
  expect(deletePhoto).not.toHaveBeenCalled();
});

test("approving without the photo drops it and deletes it from the bucket", async () => {
  const id = await addShop("nomad", "pending", "shops/abc.webp");

  await approveSubmission(id, { x: 2.17, y: 41.38 }, true);

  expect(await findShop(id)).toMatchObject({ status: "live", photoKey: null });
  expect(deletePhoto).toHaveBeenCalledWith("shops/abc.webp");
});

test("rejecting drops the photo and deletes it from the bucket", async () => {
  const id = await addShop("nomad", "pending", "shops/abc.webp");

  await rejectSubmission(id);

  expect(await findShop(id)).toMatchObject({
    status: "rejected",
    photoKey: null,
  });
  expect(deletePhoto).toHaveBeenCalledWith("shops/abc.webp");
});

test("a Shop that isn't pending anymore keeps its photo", async () => {
  const live = await addShop("live", "live", "shops/abc.webp");

  await rejectSubmission(live);
  await approveSubmission(live, { x: 2.17, y: 41.38 }, true);

  expect(await findShop(live)).toMatchObject({ photoKey: "shops/abc.webp" });
  expect(deletePhoto).not.toHaveBeenCalled();
});
