import { expect, test } from "vitest";
import { formatDistance } from "@/lib/format-distance";

test("under 1 km shows metres, to the nearest 10", () => {
  expect(formatDistance(812)).toBe("810 m");
});

test("from 1 km shows kilometres, with one decimal only when needed", () => {
  expect(formatDistance(996)).toBe("1 km"); // 1000 m once rounded, so not "1000 m"
  expect(formatDistance(1240)).toBe("1.2 km");
  expect(formatDistance(2000)).toBe("2 km");
});
