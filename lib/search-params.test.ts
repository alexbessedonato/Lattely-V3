import { expect, test } from "vitest";
import { widerRadius } from "@/lib/search-params";

test("widening goes up one Radius option at a time", () => {
  expect(widerRadius(500)).toBe(1000);
  expect(widerRadius(2000)).toBe(5000);
});

test("there is nothing wider than 5 km", () => {
  expect(widerRadius(5000)).toBeNull();
});
