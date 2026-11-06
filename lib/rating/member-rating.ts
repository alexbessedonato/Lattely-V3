import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { ratings } from "@/db/schema";

// How many stars this Member gave the Shop, or null if they haven't rated it.
export async function getMemberRating(member: { id: string }, shopId: number) {
  const [rating] = await db
    .select({ stars: ratings.stars })
    .from(ratings)
    .where(and(eq(ratings.memberId, member.id), eq(ratings.shopId, shopId)));
  return rating?.stars ?? null;
}
