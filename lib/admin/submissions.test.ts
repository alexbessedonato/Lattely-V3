import { eq } from "drizzle-orm";
import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import {
  approveSubmission,
  getPendingSubmissions,
  rejectSubmission,
} from "@/lib/admin/submissions";

beforeEach(async () => {
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

  const pending = await getPendingSubmissions();
  expect(pending.map((shop) => shop.name)).toEqual(["first", "second"]);
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

test("approving keeps the Member's photo, and has no photo to delete", async () => {
  const id = await addShop("nomad", "pending", "shops/abc.webp");

  expect(await approveSubmission(id, { x: 2.17, y: 41.38 })).toBeNull();

  expect(await findShop(id)).toMatchObject({ photoKey: "shops/abc.webp" });
});

test("approving without the photo drops it, and hands back its key to delete", async () => {
  const id = await addShop("nomad", "pending", "shops/abc.webp");

  const removed = await approveSubmission(id, { x: 2.17, y: 41.38 }, true);

  expect(removed).toBe("shops/abc.webp");
  expect(await findShop(id)).toMatchObject({ status: "live", photoKey: null });
});

test("rejecting drops the photo, and hands back its key to delete", async () => {
  const id = await addShop("nomad", "pending", "shops/abc.webp");

  expect(await rejectSubmission(id)).toBe("shops/abc.webp");

  expect(await findShop(id)).toMatchObject({
    status: "rejected",
    photoKey: null,
  });
});

test("a Shop that isn't pending anymore keeps its photo", async () => {
  const live = await addShop("live", "live", "shops/abc.webp");

  expect(await rejectSubmission(live)).toBeNull();
  expect(await approveSubmission(live, { x: 2.17, y: 41.38 }, true)).toBeNull();

  expect(await findShop(live)).toMatchObject({ photoKey: "shops/abc.webp" });
});
