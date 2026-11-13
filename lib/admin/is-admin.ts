import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { admins } from "@/db/schema";

// True if this Member has a row in admins.
export async function isAdmin(member: { id: string }) {
  const [row] = await db
    .select()
    .from(admins)
    .where(eq(admins.memberId, member.id));
  return row !== undefined;
}
