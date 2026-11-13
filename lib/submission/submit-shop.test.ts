import { afterAll, beforeEach, expect, test } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { submitShop } from "@/lib/submission/submit-shop";

// Every test starts from no Shops (Ratings go first, since they point at Shops).
beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
});

afterAll(() => db.$client.end());

const member = { id: "member-1" };

function submission(name: string) {
  return { name, address: "Carrer 1", instagramOrWebsite: null };
}

test("a Submission is saved as a pending Shop of that Member", async () => {
  expect(await submitShop(member, submission("Nomad Café"))).toBeNull();

  expect(await db.select().from(shops)).toMatchObject([
    {
      name: "Nomad Café",
      slug: "nomad-cafe",
      status: "pending",
      submittedBy: "member-1",
    },
  ]);
});

test("a 4th pending Submission is refused with a message", async () => {
  for (const name of ["A", "B", "C"]) {
    expect(await submitShop(member, submission(name))).toBeNull();
  }

  expect(await submitShop(member, submission("D"))).toMatch(/already have 3/);
  expect(await db.select().from(shops)).toHaveLength(3);
});

test("Shops that aren't pending anymore, or are another Member's, don't count", async () => {
  // 2 of member-1's Submissions already checked by an Admin, and 3 pending from someone else.
  await db.insert(shops).values(
    [
      { status: "live" as const, submittedBy: "member-1" },
      { status: "rejected" as const, submittedBy: "member-1" },
      { status: "pending" as const, submittedBy: "member-2" },
      { status: "pending" as const, submittedBy: "member-2" },
      { status: "pending" as const, submittedBy: "member-2" },
    ].map((shop, i) => ({
      ...shop,
      name: `Old ${i}`,
      slug: `old-${i}`,
      address: "Carrer 1",
    })),
  );

  for (const name of ["A", "B", "C"]) {
    expect(await submitShop(member, submission(name))).toBeNull();
  }
});

test("two Shops with the same name get different slugs", async () => {
  await submitShop(member, submission("Nomad"));
  await submitShop(member, submission("Nomad"));

  const [first, second] = await db
    .select({ slug: shops.slug })
    .from(shops)
    .orderBy(shops.id);
  expect(first.slug).toBe("nomad");
  expect(second.slug).toMatch(/^nomad-.{6}$/);
});
