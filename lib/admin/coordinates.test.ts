import { expect, test } from "vitest";
import { parseCoordinates } from "@/lib/admin/coordinates";

test("latitude, longitude as Google Maps copies them become a point", () => {
  expect(parseCoordinates("41.3851, 2.1734")).toEqual({
    x: 2.1734,
    y: 41.3851,
  });
  expect(parseCoordinates(" 41.3851,2.1734 ")).toEqual({
    x: 2.1734,
    y: 41.3851,
  });
});

test("anything that isn't a point in Barcelona is refused", () => {
  for (const text of [
    "",
    "41.3851",
    "hello, world",
    "2.1734, 41.3851", // swapped
    "48.8566, 2.3522", // Paris
  ]) {
    expect(parseCoordinates(text)).toBeNull();
  }
});
