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
      photoKey: shops.photoKey,
    })
    .from(shops)
    .where(eq(shops.status, "pending"))
    .orderBy(shops.id);
}

// Makes the Submission a live Shop at that point. With removePhoto, it goes live without the Member's photo.
// Returns the key of a photo that was dropped, for the caller to delete from the bucket, or null.
// Does nothing (and returns null) if it isn't pending anymore.
export async function approveSubmission(
  submissionId: number,
  location: Point,
  removePhoto = false,
) {
  const photoKey = await pendingPhotoKey(submissionId);
  await db
    .update(shops)
    .set(
      removePhoto
        ? { status: "live", location, photoKey: null }
        : { status: "live", location },
    )
    .where(and(eq(shops.id, submissionId), eq(shops.status, "pending")));
  return removePhoto ? photoKey : null;
}

// Turns the Submission down and drops its photo. Returns that photo's key, for the caller to delete
// from the bucket, or null. Does nothing (and returns null) if it isn't pending anymore.
export async function rejectSubmission(submissionId: number) {
  const photoKey = await pendingPhotoKey(submissionId);
  await db
    .update(shops)
    .set({ status: "rejected", photoKey: null })
    .where(and(eq(shops.id, submissionId), eq(shops.status, "pending")));
  return photoKey;
}

// The photo key of a Submission that is still pending; null if it has none or isn't pending.
async function pendingPhotoKey(submissionId: number) {
  const [submission] = await db
    .select({ photoKey: shops.photoKey })
    .from(shops)
    .where(and(eq(shops.id, submissionId), eq(shops.status, "pending")));
  return submission?.photoKey ?? null;
}
