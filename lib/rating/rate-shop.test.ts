import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { rateShop } from "@/lib/rating/rate-shop";

// Every test starts from no Shops and no Ratings.
beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

const member = { id: "member-1" };

async function addShop(status: "live" | "closed" = "live") {
  const [shop] = await db
    .insert(shops)
    .values({ name: "shop", slug: "shop", address: "Carrer 1", status })
    .returning();
  return shop;
}

test("rating a Shop twice replaces the first Rating", async () => {
  const shop = await addShop();

  await rateShop(member, shop.id, 2);
  await rateShop(member, shop.id, 5);

  expect(await db.select().from(ratings)).toMatchObject([
    { memberId: "member-1", shopId: shop.id, stars: 5 },
  ]);
});

test("a Shop that isn't live can't be rated", async () => {
  const shop = await addShop("closed");

  await expect(rateShop(member, shop.id, 5)).rejects.toThrow();
  expect(await db.select().from(ratings)).toEqual([]);
});

test.each([0, 6, 2.5])("%s stars are refused", async (stars) => {
  const shop = await addShop();

  await expect(rateShop(member, shop.id, stars)).rejects.toThrow();
  expect(await db.select().from(ratings)).toEqual([]);
});
