import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { getMySubmissions } from "@/lib/submission/my-submissions";
import { submitShop } from "@/lib/submission/submit-shop";

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

test("a Member sees only their own Submissions, newest first", async () => {
  const shop = { address: "Carrer 1", instagramOrWebsite: null };
  await submitShop({ id: "member-1" }, { ...shop, name: "Older" });
  await submitShop({ id: "member-2" }, { ...shop, name: "Someone else's" });
  await submitShop({ id: "member-1" }, { ...shop, name: "Newer" });

  expect(await getMySubmissions({ id: "member-1" })).toMatchObject([
    { name: "Newer", status: "pending" },
    { name: "Older", status: "pending" },
  ]);
});
