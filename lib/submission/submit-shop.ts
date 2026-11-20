import { and, count, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { shops } from "@/db/schema";
import type { Submission } from "@/lib/submission/types/submission";

// How many Submissions a Member can have waiting for an Admin at once.
export const MAX_PENDING_SUBMISSIONS = 3;

// Saves the Member's Submission as a pending Shop, with its photo's key if it has one.
// Returns why it was refused, or null if it was saved.
export async function submitShop(
  member: { id: string },
  submission: Submission,
  photoKey: string | null = null,
): Promise<string | null> {
  // shortcut: two submits at the exact same moment could both pass this check; add a database rule if that ever matters.
  const [{ pendingSubmissions }] = await db
    .select({ pendingSubmissions: count() })
    .from(shops)
    .where(and(eq(shops.submittedBy, member.id), eq(shops.status, "pending")));
  if (pendingSubmissions >= MAX_PENDING_SUBMISSIONS) {
    return `You already have ${MAX_PENDING_SUBMISSIONS} shops waiting for review. You can submit another once one is checked.`;
  }

  await db.insert(shops).values({
    ...submission,
    slug: await freeSlug(submission.name),
    status: "pending",
    submittedBy: member.id,
    photoKey,
  });
  return null;
}

// "Café Nº 1!" → "cafe-n-1". If a Shop already has that slug, a short random ending keeps it unique.
async function freeSlug(name: string) {
  const slug =
    name
      .normalize("NFD") // splits "é" into "e" + its accent…
      .replace(/\p{Diacritic}/gu, "") // …so the accent can be dropped
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "shop"; // a name with no letters or digits still gets a slug

  const [taken] = await db
    .select({ id: shops.id })
    .from(shops)
    .where(eq(shops.slug, slug));
  return taken ? `${slug}-${crypto.randomUUID().slice(0, 6)}` : slug;
}
