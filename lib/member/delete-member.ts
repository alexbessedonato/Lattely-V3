import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { ratings, shops } from "@/db/schema";

// Removes what we keep about the Member: their Ratings go, and the Shops they suggested stay but forget who did.
// One transaction, so it's all or nothing. Their login lives in Neon Auth: see lib/auth/delete-login.ts.
export async function deleteMember(member: { id: string }) {
  await db.transaction(async (tx) => {
    await tx.delete(ratings).where(eq(ratings.memberId, member.id));
    await tx
      .update(shops)
      .set({ submittedBy: null })
      .where(eq(shops.submittedBy, member.id));
  });
}
