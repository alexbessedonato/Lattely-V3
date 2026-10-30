import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shops } from "@/db/schema";

export async function getRanking() {
  return db.select().from(shops).where(eq(shops.status, "live"));
}
