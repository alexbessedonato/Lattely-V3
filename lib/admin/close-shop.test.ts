import { eq } from "drizzle-orm";
import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { closeShop, getLiveShops } from "@/lib/admin/close-shop";
import { getRanking } from "@/lib/ranking/ranking";

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

async function addShop(name: string, status: "pending" | "live") {
  const [shop] = await db
    .insert(shops)
    .values({ name, slug: name, address: "Carrer 1", status })
    .returning({ id: shops.id });
  return shop.id;
}

test("only live Shops are listed, by name", async () => {
  await addShop("nomad", "live");
  await addShop("waiting", "pending");
  await addShop("hidden", "live");

  const live = await getLiveShops();
  expect(live.map((shop) => shop.name)).toEqual(["hidden", "nomad"]);
});

test("a closed Shop leaves the Ranking and keeps its Ratings", async () => {
  const id = await addShop("nomad", "live");
  await db
    .insert(ratings)
    .values({ memberId: "member-1", shopId: id, stars: 5 });

  await closeShop(id);

  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  expect(shop.status).toBe("closed");
  expect(await getRanking()).toEqual([]);
  expect(await db.select().from(ratings)).toHaveLength(1);
});

test("a Shop that isn't live can't be closed", async () => {
  const id = await addShop("waiting", "pending");

  await closeShop(id);

  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  expect(shop.status).toBe("pending");
});
