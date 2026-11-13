import type { radiusOptionsM } from "@/lib/ranking/search-params";

// One of the Radius options in metres: 500 | 1000 | 2000 | 5000.
export type RadiusM = (typeof radiusOptionsM)[number];
