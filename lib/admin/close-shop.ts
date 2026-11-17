import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { shops } from "@/db/schema";

// Every live Shop, A to Z, so the Admin can find one that has shut down.
export async function getLiveShops() {
  return db
    .select({ id: shops.id, name: shops.name, address: shops.address })
    .from(shops)
    .where(eq(shops.status, "live"))
    .orderBy(shops.name);
}

// Hides a live Shop that has shut down. Its Ratings stay; the Ranking only shows live Shops.
export async function closeShop(shopId: number) {
  await db
    .update(shops)
    .set({ status: "closed" })
    .where(and(eq(shops.id, shopId), eq(shops.status, "live")));
}
