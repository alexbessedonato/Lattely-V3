import { eq } from "drizzle-orm";
import { afterAll, beforeEach, expect, test, vi } from "vitest";
import { db } from "@/db/client";
import { admins, ratings, shops } from "@/db/schema";
import { approveSubmissionAction } from "@/lib/admin/approve-submission-action";
import { closeShopAction } from "@/lib/admin/close-shop-action";
import { rejectSubmissionAction } from "@/lib/admin/reject-submission-action";
import { getMember } from "@/lib/auth/auth-server";

// Tests can't sign in, so we replace getMember with a fake and choose who is "signed in" in each test.
vi.mock("@/lib/auth/auth-server", () => ({ getMember: vi.fn() }));
// refresh() only works inside a real request; here it does nothing.
vi.mock("next/cache", () => ({ refresh: vi.fn() }));

function signInAs(member: { id: string } | null) {
  vi.mocked(getMember).mockResolvedValue(member as never);
}

beforeEach(async () => {
  await db.delete(ratings);
  await db.delete(shops);
  await db.delete(admins);
  await db.insert(admins).values({ memberId: "admin-1" });
});

afterAll(() => db.$client.end());

async function addShop(status: "pending" | "live") {
  const [shop] = await db
    .insert(shops)
    .values({ name: status, slug: status, address: "Carrer 1", status })
    .returning({ id: shops.id });
  return shop.id;
}

async function statusOf(id: number) {
  const [shop] = await db.select().from(shops).where(eq(shops.id, id));
  return shop.status;
}

function coordinates(text: string) {
  const formData = new FormData();
  formData.set("coordinates", text);
  return formData;
}

for (const [who, member] of [
  ["a Visitor who isn't signed in", null],
  ["a Member who isn't an Admin", { id: "member-1" }],
] as const) {
  test(`${who} is refused by every admin action, and nothing changes`, async () => {
    signInAs(member);
    const pending = await addShop("pending");
    const live = await addShop("live");

    await expect(
      approveSubmissionAction(
        pending,
        { coordinates: "" },
        coordinates("41.38, 2.17"),
      ),
    ).rejects.toThrow("Only Admins");
    await expect(rejectSubmissionAction(pending)).rejects.toThrow(
      "Only Admins",
    );
    await expect(closeShopAction(live)).rejects.toThrow("Only Admins");

    expect(await statusOf(pending)).toBe("pending");
    expect(await statusOf(live)).toBe("live");
  });
}

// Proves the fake sign-in really works, so the refusals above aren't passing by accident.
test("an Admin gets through every admin action", async () => {
  signInAs({ id: "admin-1" });
  const toApprove = await addShop("pending");
  const live = await addShop("live");

  await approveSubmissionAction(
    toApprove,
    { coordinates: "" },
    coordinates("41.38, 2.17"),
  );
  await closeShopAction(live);

  expect(await statusOf(toApprove)).toBe("live");
  expect(await statusOf(live)).toBe("closed");
});
