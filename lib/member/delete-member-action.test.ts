import { afterAll, beforeEach, expect, test, vi } from "vitest";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";
import { deleteMemberAction } from "@/lib/member/delete-member-action";
import { auth, getMember } from "@/lib/auth/auth-server";
import { deleteLogin } from "@/lib/auth/delete-login";

// Tests can't sign in or reach Neon, so these are fakes; each test picks who is "signed in".
vi.mock("@/lib/auth/auth-server", () => ({
  getMember: vi.fn(),
  auth: { signOut: vi.fn() },
}));
vi.mock("@/lib/auth/delete-login", () => ({ deleteLogin: vi.fn() }));
// redirect() only works inside a real request; here it throws so we can see where it went.
vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`redirect ${to}`);
  }),
}));

function signInAs(member: { id: string } | null) {
  vi.mocked(getMember).mockResolvedValue(member as never);
}

beforeEach(async () => {
  vi.clearAllMocks();
  await db.delete(ratings);
  await db.delete(shops);
  const [shop] = await db
    .insert(shops)
    .values({
      name: "nomad",
      slug: "nomad",
      address: "Carrer 1",
      status: "live",
    })
    .returning({ id: shops.id });
  await db
    .insert(ratings)
    .values({ memberId: "member-1", shopId: shop.id, stars: 5 });
});

afterAll(() => db.$client.end());

test("a Member's Ratings and login are deleted, then they go home", async () => {
  signInAs({ id: "member-1" });

  await expect(deleteMemberAction()).rejects.toThrow("redirect /");

  expect(await db.select().from(ratings)).toEqual([]);
  expect(auth.signOut).toHaveBeenCalled();
  expect(deleteLogin).toHaveBeenCalledWith({ id: "member-1" });
});

test("a Visitor who isn't signed in is sent to sign in and nothing is deleted", async () => {
  signInAs(null);

  await expect(deleteMemberAction()).rejects.toThrow("redirect /sign-in");

  expect(await db.select().from(ratings)).toHaveLength(1);
  expect(deleteLogin).not.toHaveBeenCalled();
});

test("if Neon refuses to delete the login, the action fails instead of pretending it worked", async () => {
  signInAs({ id: "member-1" });
  vi.mocked(deleteLogin).mockRejectedValue(new Error("nope"));

  await expect(deleteMemberAction()).rejects.toThrow("nope");
});
