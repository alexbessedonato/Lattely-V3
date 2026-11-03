import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { getShop } from "@/lib/shop";

// Every test starts from no Shops and no Ratings.
beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

async function addShop(name: string, status: "live" | "closed" = "live") {
  const [shop] = await db
    .insert(shops)
    .values({ name, slug: name, address: "Carrer 1", status })
    .returning();
  return shop;
}

// `count` Ratings of `stars`, each from a different Member.
async function rate(shopId: number, stars: number, count: number) {
  await db.insert(ratings).values(
    Array.from({ length: count }, (_, i) => ({
      memberId: `member-${i}`,
      shopId,
      stars,
    })),
  );
}

test("a Shop comes with its Average rating, Rating count and Barcelona-wide Rank", async () => {
  const first = await addShop("first");
  const second = await addShop("second");
  await rate(first.id, 5, 10);
  await rate(second.id, 3, 4);

  const shop = await getShop("second");

  expect(shop).toMatchObject({
    name: "second",
    address: "Carrer 1",
    averageRating: 3,
    ratingCount: 4,
    rank: 2,
  });
});

test("an Unrated Shop has no Average rating and still has a Rank", async () => {
  await addShop("brand-new");

  const shop = await getShop("brand-new");

  expect(shop).toMatchObject({ averageRating: null, ratingCount: 0, rank: 1 });
});

test("there is no Shop for an unknown slug, or one that isn't live", async () => {
  await addShop("closed", "closed");

  expect(await getShop("nope")).toBeNull();
  expect(await getShop("closed")).toBeNull();
});
