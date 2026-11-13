import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { shops } from "@/db/schema";

// Every Shop this Member submitted, newest first, with what happened to it.
export async function getMySubmissions(member: { id: string }) {
  return db
    .select({
      id: shops.id,
      name: shops.name,
      slug: shops.slug,
      address: shops.address,
      status: shops.status,
    })
    .from(shops)
    .where(eq(shops.submittedBy, member.id))
    .orderBy(desc(shops.id));
}
