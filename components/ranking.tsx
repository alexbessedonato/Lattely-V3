import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatDistance } from "@/lib/format-distance";
import type { getRanking } from "@/lib/ranking";
import {
  type RadiusM,
  serializeFilterParams,
  widerRadius,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";

export type RankedShop = Awaited<ReturnType<typeof getRanking>>[number];

// The Centre point as it's written in the URL, so the "widen" link can keep it.
type Centre = { n: string } | { near: "me" };

// Drawn by the server page for a Neighbourhood or all of Barcelona, and by NearMeRanking in the browser for Near me.
export function Ranking({
  ranking,
  centre,
  radiusM,
}: {
  ranking: RankedShop[];
  centre: Centre | null;
  radiusM: RadiusM | null;
}) {
  const [first, ...runnersUp] = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <>
      {centre && radiusM && ranking.length === 0 && (
        <NoShops centre={centre} radiusM={radiusM} />
      )}

      {first && (
        <section aria-label="Top three" className="mt-4 flex flex-col gap-3.5">
          <ShopCard shop={first} big />

          <div className="grid grid-cols-2 gap-3.5">
            {runnersUp.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-label="More shops" className="mt-6">
          <h2 className="mb-2 font-heading text-[22px] font-semibold">
            Also worth the walk
          </h2>

          <ol>
            {rest.map((shop) => (
              <li
                key={shop.id}
                className="flex min-h-15 items-center gap-3.5 border-b border-latte"
              >
                <span className="w-6 text-right font-heading text-[17px] font-semibold text-clay">
                  {shop.rank}
                </span>

                <span className="flex-1 font-semibold">{shop.name}</span>

                <AverageRating shop={shop} />

                <Distance shop={shop} />
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

// A filter that finds nothing offers the next Radius up, or all of Barcelona after 5 km.
function NoShops({ centre, radiusM }: { centre: Centre; radiusM: RadiusM }) {
  const wider = widerRadius(radiusM);

  return (
    <section className="mt-4 flex flex-col items-center gap-4 rounded-[20px] border border-latte bg-paper p-6 text-center">
      <p className="font-heading text-[22px] font-semibold">
        No shops within {formatDistance(radiusM)}
      </p>

      {/* A plain link: it only goes to another URL, so it works before JavaScript loads and Back undoes it */}
      <Link
        href={wider ? serializeFilterParams({ ...centre, r: wider }) : "/"}
        className={cn(buttonVariants(), "h-11 rounded-full px-5 text-base")}
      >
        {wider ? `Widen to ${formatDistance(wider)}` : "Show all of Barcelona"}
      </Link>
    </section>
  );
}

function ShopCard({ shop, big = false }: { shop: RankedShop; big?: boolean }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-latte bg-paper">
      <div className={`relative ${big ? "h-55" : "h-30"}`}>
        <Image
          src={fallbackImage(shop.id)}
          alt=""
          fill
          className="object-cover"
        />

        <span className="absolute top-3 left-3 rounded-full border border-espresso bg-cream px-3 py-1 font-heading font-bold">
          No. {shop.rank}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <h3
          className={`font-heading leading-tight font-semibold ${big ? "text-[22px]" : "text-[17px]"}`}
        >
          {shop.name}
        </h3>

        <div className="flex items-center justify-between">
          <AverageRating shop={shop} />

          <Distance shop={shop} />
        </div>
      </div>
    </article>
  );
}

function AverageRating({ shop }: { shop: RankedShop }) {
  if (shop.averageRating === null) {
    return <span className="text-sm text-mocha">No ratings yet</span>;
  }
  return (
    <span className="flex items-center gap-1 text-sm font-bold">
      <Star className="size-3.5 fill-clay text-clay" aria-hidden />

      {shop.averageRating.toFixed(1)}
    </span>
  );
}

// Only shown when there's a Centre point to measure from.
function Distance({ shop }: { shop: RankedShop }) {
  if (shop.distanceM === null) return null;
  return (
    <span className="text-sm text-mocha">{formatDistance(shop.distanceM)}</span>
  );
}

// shortcut: Shops have no photo column yet, so every Shop uses a fallback; add one when real photos exist.
// Picked from the id, so a Shop always gets the same image.
function fallbackImage(shopId: number) {
  return `/fallbacks/${(shopId % 6) + 1}.svg`;
}
