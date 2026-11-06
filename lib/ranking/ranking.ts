import { and, asc, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";

// How many "average" Ratings every Shop starts with, so one 5-star Rating can't top the Ranking.
const PRIOR_WEIGHT = 5;

// Longitude (x) and latitude (y), like the location columns.
export type Point = { x: number; y: number };

// No filter means all of Barcelona (the "Anywhere" Radius).
export async function getRanking(filter?: {
  centrePoint: Point;
  radiusM: number;
}) {
  const averageOfAllRatings = sql`(select avg(${ratings.stars}) from ${ratings} join ${shops} on ${shops.id} = ${ratings.shopId} where ${shops.status} = 'live')`;
  // Ranking score: the Shop's own average, pulled towards averageOfAllRatings until it has enough Ratings.
  const rankingScore = sql`(coalesce(sum(${ratings.stars}), 0) + ${PRIOR_WEIGHT} * ${averageOfAllRatings}) / (count(${ratings.stars}) + ${PRIOR_WEIGHT})`;
  const isUnrated = sql`count(${ratings.stars}) = 0`;
  // geography measures in metres on the round Earth.
  const shopLocation = sql`${shops.location}::geography`;
  const centre =
    filter &&
    sql`ST_MakePoint(${filter.centrePoint.x}, ${filter.centrePoint.y})::geography`;

  const rows = await db
    .select({
      ...getTableColumns(shops),
      averageRating: sql<
        number | null
      >`round(avg(${ratings.stars}), 1)`.mapWith(Number),
      ratingCount: count(ratings.stars),
      distanceM: sql<number | null>`${
        centre ? sql`round(ST_Distance(${shopLocation}, ${centre}))` : sql`null`
      }`.mapWith(Number),
    })
    .from(shops)
    .leftJoin(ratings, eq(ratings.shopId, shops.id))
    .where(
      and(
        eq(shops.status, "live"),
        // Shops with no location never match.
        centre &&
          sql`ST_DWithin(${shopLocation}, ${centre}, ${filter.radiusM})`,
      ),
    )
    .groupBy(shops.id)
    .orderBy(
      asc(isUnrated), // false sorts before true, so Unrated Shops go last
      desc(rankingScore),
      asc(shops.name), // name breaks ties, so the order never jumps around
    );

  return rows.map((shop, i) => ({ ...shop, rank: i + 1 }));
}
