import type { getRanking } from "@/lib/ranking/ranking";

// One Shop in the Ranking, exactly as getRanking returns it.
export type RankedShop = Awaited<ReturnType<typeof getRanking>>[number];
