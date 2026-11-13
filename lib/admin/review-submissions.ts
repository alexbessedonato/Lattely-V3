import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { shops } from "@/db/schema";
import type { Point } from "@/lib/ranking/types/point";

// Every Submission still waiting for an Admin, oldest first.
export async function getPendingSubmissions() {
  return db
    .select({
      id: shops.id,
      name: shops.name,
      address: shops.address,
      instagramOrWebsite: shops.instagramOrWebsite,
    })
    .from(shops)
    .where(eq(shops.status, "pending"))
    .orderBy(shops.id);
}

// Makes the Submission a live Shop at that point. Does nothing if it isn't pending anymore.
export async function approveSubmission(shopId: number, location: Point) {
  await db
    .update(shops)
    .set({ status: "live", location })
    .where(and(eq(shops.id, shopId), eq(shops.status, "pending")));
}

// Turns the Submission down. Does nothing if it isn't pending anymore.
export async function rejectSubmission(shopId: number) {
  await db
    .update(shops)
    .set({ status: "rejected" })
    .where(and(eq(shops.id, shopId), eq(shops.status, "pending")));
}
