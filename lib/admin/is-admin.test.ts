import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { admins } from "@/db/schema";
import { isAdmin } from "@/lib/admin/is-admin";

beforeEach(async () => {
  await db.delete(admins);
});

afterAll(() => db.$client.end());

test("a Member listed in admins is an Admin", async () => {
  await db.insert(admins).values({ memberId: "member-1" });

  expect(await isAdmin({ id: "member-1" })).toBe(true);
});

test("any other Member is not an Admin", async () => {
  await db.insert(admins).values({ memberId: "member-1" });

  expect(await isAdmin({ id: "member-2" })).toBe(false);
});
