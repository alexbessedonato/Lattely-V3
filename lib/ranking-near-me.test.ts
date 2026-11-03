import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { getRankingNearMe } from "@/lib/ranking-near-me";

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

// Plaça de Catalunya, and a point 300 m due north of it (0.001° of latitude is about 111 m).
const placaCatalunya = { x: 2.17, y: 41.387 };
const north300m = { x: 2.17, y: 41.387 + 300 / 111_195 };

test("the Ranking around the Visitor's location only has Shops within the Radius", async () => {
  await db.insert(shops).values([
    {
      name: "Round the corner",
      slug: "round-the-corner",
      address: "Carrer 1",
      status: "live",
      location: north300m,
    },
    {
      name: "Across town",
      slug: "across-town",
      address: "Carrer 2",
      status: "live",
      location: { x: 2.17, y: 41.387 + 3000 / 111_195 },
    },
  ]);

  const ranking = await getRankingNearMe(placaCatalunya, 1000);

  expect(ranking.map(({ name, distanceM }) => ({ name, distanceM }))).toEqual([
    { name: "Round the corner", distanceM: expect.closeTo(300, -1) },
  ]);
});

// Anyone can call a Server Action with anything, so these come from outside our own code.
test("a location that isn't on Earth is refused", async () => {
  for (const location of [
    { x: 2.17, y: 91 },
    { x: 181, y: 41.387 },
    { x: Number.NaN, y: 41.387 },
    { x: "2.17", y: 41.387 },
    null,
  ]) {
    // @ts-expect-error -- calling it the way a stranger on the network could
    await expect(getRankingNearMe(location, 1000)).rejects.toThrow();
  }
});

test("a Radius that isn't one of the options is refused", async () => {
  // @ts-expect-error -- 1234 isn't a Radius option
  await expect(getRankingNearMe(placaCatalunya, 1234)).rejects.toThrow();
});
