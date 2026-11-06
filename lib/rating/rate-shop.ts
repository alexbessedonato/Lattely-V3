import { db } from "@/db/client";
import { ratings } from "@/db/schema";

// Gives the Shop 1–5 whole stars from this Member, replacing their earlier Rating if they had one.
export async function rateShop(
  member: { id: string },
  shopId: number,
  stars: number,
) {
  // The database refuses 0 or 6 too, but checking here also catches 2.5 and gives a clear message.
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error(`A Rating is 1 to 5 whole stars, not ${stars}.`);
  }

  await db
    .insert(ratings)
    .values({ memberId: member.id, shopId, stars })
    // One Rating per Member per Shop: if it already exists, just change its stars.
    .onConflictDoUpdate({
      target: [ratings.memberId, ratings.shopId],
      set: { stars },
    });
}
