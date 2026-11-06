"use server";

import { getRanking, type Point } from "@/lib/ranking/ranking";
import { type RadiusM, radiusOptionsM } from "@/lib/ranking/search-params";

// A Server Action: the browser calls it with a POST, so the location travels in the request body,
// never in the URL. It's used for this one request and never logged or stored (ADR-0002).
export async function getRankingNearMe(location: Point, radiusM: RadiusM) {
  // Anyone can call a Server Action with anything, so check the input before it reaches the database.
  if (!isBetween(location?.x, -180, 180) || !isBetween(location?.y, -90, 90)) {
    throw new Error("Not a location");
  }
  if (!radiusOptionsM.includes(radiusM)) throw new Error("Not a Radius");

  try {
    return await getRanking({
      centrePoint: { x: location.x, y: location.y },
      radiusM,
    });
  } catch {
    // A database error message repeats the query's values, the location included, and errors get logged.
    throw new Error("Couldn't load the Ranking");
  }
}

function isBetween(value: unknown, min: number, max: number) {
  return typeof value === "number" && value >= min && value <= max; // NaN fails both comparisons
}
