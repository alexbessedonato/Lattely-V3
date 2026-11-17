import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { ratings } from "@/db/schema";

// Removes everything of the Member's that we keep: their Ratings. The Ranking is worked out from Ratings on
// every visit, so it updates by itself. Their login lives in Neon Auth, which the Server Action deletes next.
export async function deleteMember(member: { id: string }) {
  await db.delete(ratings).where(eq(ratings.memberId, member.id));
}
