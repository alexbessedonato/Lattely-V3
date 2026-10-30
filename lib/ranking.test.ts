import { afterAll, expect, test } from "vitest";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { getRanking } from "@/lib/ranking";

afterAll(() => db.$client.end());

test("the Ranking only includes live Shops", async () => {
  await db.insert(shops).values([
    {
      name: "Live Shop",
      slug: "live-shop",
      address: "Carrer 1",
      status: "live",
    },
    {
      name: "Closed Shop",
      slug: "closed-shop",
      address: "Carrer 2",
      status: "closed",
    },
    {
      name: "Submitted Shop",
      slug: "submitted-shop",
      address: "Carrer 3",
      status: "submission",
    },
  ]);

  const ranking = await getRanking();

  expect(ranking.map((shop) => shop.name)).toEqual(["Live Shop"]);
});
