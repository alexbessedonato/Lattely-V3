import { expect, test } from "vitest";
import { resolveFilter, widerRadius } from "@/lib/ranking/search-params";

test("widening goes up one Radius option at a time", () => {
  expect(widerRadius(500)).toBe(1000);
  expect(widerRadius(2000)).toBe(5000);
});

test("there is nothing wider than 5 km", () => {
  expect(widerRadius(5000)).toBeNull();
});

const neighbourhoods = [{ slug: "gracia" }, { slug: "el-born" }];

test("a known slug is the Centre point, and a missing Radius means 2 km", () => {
  expect(
    resolveFilter(neighbourhoods, { n: "gracia", near: null, r: null }),
  ).toEqual({
    neighbourhood: { slug: "gracia" },
    nearMe: false,
    radiusM: 2000,
  });
  expect(
    resolveFilter(neighbourhoods, { n: "gracia", near: null, r: 500 }).radiusM,
  ).toBe(500);
});

test("an unknown or missing slug means no Centre point, so no Radius either", () => {
  for (const n of ["nowhere", null]) {
    expect(resolveFilter(neighbourhoods, { n, near: null, r: 500 })).toEqual({
      neighbourhood: undefined,
      nearMe: false,
      radiusM: null,
    });
  }
});

test("near=me is the Centre point, starting at 2 km", () => {
  expect(
    resolveFilter(neighbourhoods, { n: null, near: "me", r: null }),
  ).toEqual({
    neighbourhood: undefined,
    nearMe: true,
    radiusM: 2000,
  });
  expect(
    resolveFilter(neighbourhoods, { n: null, near: "me", r: 5000 }).radiusM,
  ).toBe(5000);
});
