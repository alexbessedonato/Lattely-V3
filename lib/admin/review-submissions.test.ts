import { eq } from "drizzle-orm";
import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import {
  approveSubmission,
  getPendingSubmissions,
  rejectSubmission,
} from "@/lib/admin/review-submissions";

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

async function addShop(name: string, status: "pending" | "live" | "rejected") {
  const [shop] = await db
    .insert(shops)
    .values({ name, slug: name, address: "Carrer 1", status })
    .returning({ id: shops.id });
  return shop.id;
}

async function statusOf(id: number) {
  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  return shop;
}

test("only pending Shops are listed for review, oldest first", async () => {
  await addShop("first", "pending");
  await addShop("live", "live");
  await addShop("second", "pending");

  const pending = await getPendingSubmissions();
  expect(pending.map((shop) => shop.name)).toEqual(["first", "second"]);
});

test("approving makes the Shop live at the given point", async () => {
  const id = await addShop("nomad", "pending");

  await approveSubmission(id, { x: 2.17, y: 41.38 });

  expect(await statusOf(id)).toMatchObject({
    status: "live",
    location: { x: 2.17, y: 41.38 },
  });
});

test("rejecting marks the Shop rejected", async () => {
  const id = await addShop("nomad", "pending");

  await rejectSubmission(id);

  expect(await statusOf(id)).toMatchObject({ status: "rejected" });
});

test("a Shop that isn't pending anymore can't be approved or rejected", async () => {
  const rejected = await addShop("rejected", "rejected");
  const live = await addShop("live", "live");

  await approveSubmission(rejected, { x: 2.17, y: 41.38 });
  await rejectSubmission(live);

  expect(await statusOf(rejected)).toMatchObject({
    status: "rejected",
    location: null,
  });
  expect(await statusOf(live)).toMatchObject({ status: "live" });
});
