import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { deleteMember } from "@/lib/account/delete-member";
import { getRanking } from "@/lib/ranking/ranking";

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

async function addShop(name: string) {
  const [shop] = await db
    .insert(shops)
    .values({ name, slug: name, address: "Carrer 1", status: "live" })
    .returning({ id: shops.id });
  return shop.id;
}

test("deleting a Member removes their Ratings and keeps everyone else's", async () => {
  const nomad = await addShop("nomad");
  await db.insert(ratings).values([
    { memberId: "leaving", shopId: nomad, stars: 5 },
    { memberId: "staying", shopId: nomad, stars: 2 },
  ]);

  await deleteMember({ id: "leaving" });

  expect(await db.select().from(ratings)).toMatchObject([
    { memberId: "staying", shopId: nomad, stars: 2 },
  ]);
});

test("the Ranking changes once a deleted Member's Ratings are gone", async () => {
  const nomad = await addShop("nomad");
  const satan = await addShop("satan");
  // Only "leaving" puts nomad ahead; without them satan is the only rated Shop.
  await db.insert(ratings).values([
    { memberId: "leaving", shopId: nomad, stars: 5 },
    { memberId: "staying", shopId: satan, stars: 3 },
  ]);
  const before = await getRanking();
  expect(before.map((shop) => shop.name)).toEqual(["nomad", "satan"]);

  await deleteMember({ id: "leaving" });

  const after = await getRanking();
  expect(after.map((shop) => shop.name)).toEqual(["satan", "nomad"]);
  expect(after.find((shop) => shop.name === "nomad")?.ratingCount).toBe(0);
});
