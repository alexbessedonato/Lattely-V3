import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { shops } from "@/db/schema";

export async function getRanking() {
  return db.select().from(shops).where(eq(shops.status, "live"));
}
