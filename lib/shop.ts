import { getRanking } from "@/lib/ranking";

// A live Shop with its Barcelona-wide Rank, or null if there's no live Shop with this slug.
export async function getShop(slug: string) {
  // shortcut: loads the whole Barcelona Ranking to find one Shop's Rank; fine for a few hundred Shops, move the Rank into SQL if it gets slow.
  const ranking = await getRanking();
  return ranking.find((shop) => shop.slug === slug) ?? null;
}
