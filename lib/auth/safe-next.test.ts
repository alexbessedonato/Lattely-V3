import { expect, test } from "vitest";
import { safeNext } from "@/lib/auth/safe-next";

test("keeps a path on Lattely", () => {
  expect(safeNext("/submit")).toBe("/submit");
  expect(safeNext("/shops/nomad?x=1")).toBe("/shops/nomad?x=1");
});

test.each([
  null,
  undefined,
  "",
  "submit",
  "//evil.com",
  "/\\evil.com",
  "https://evil.com",
])("sends %s to the Ranking instead", (next) => {
  expect(safeNext(next)).toBe("/");
});
