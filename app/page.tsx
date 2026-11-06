import { Suspense } from "react";
import { Account } from "@/components/account";
import { Filters } from "@/components/filters";
import { NearMeRanking } from "@/components/near-me-ranking";
import { Ranking } from "@/components/ranking";
import { getNeighbourhoods } from "@/lib/ranking/neighbourhoods";
import { getRanking } from "@/lib/ranking/ranking";
import { loadFilterParams, resolveFilter } from "@/lib/ranking/search-params";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-md px-5 pb-10">
      <header className="flex h-16 items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Lattely</h1>

        {/* Keeps the space while the session is read, so the header doesn't jump */}
        <Suspense fallback={<div className="size-11" />}>
          <Account />
        </Suspense>
      </header>

      <Suspense fallback={<p>Loading Shops…</p>}>
        <RankedShops searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// Reading searchParams also makes the page read the database on every visit, not once at build time.
async function RankedShops({
  searchParams,
}: {
  searchParams: PageProps<"/">["searchParams"];
}) {
  const neighbourhoods = await getNeighbourhoods();
  const { neighbourhood, nearMe, radiusM } = resolveFilter(
    neighbourhoods,
    await loadFilterParams(searchParams),
  );

  return (
    <>
      <Filters
        neighbourhoods={neighbourhoods.map(({ name, slug }) => ({
          name,
          slug,
        }))}
      />

      {/* The server never sees the Visitor's location, so the browser loads that Ranking itself */}
      {nearMe ? (
        <NearMeRanking />
      ) : (
        <Ranking
          ranking={await getRanking(
            neighbourhood && { centrePoint: neighbourhood.centre, radiusM },
          )}
          centre={neighbourhood ? { n: neighbourhood.slug } : null}
          radiusM={radiusM}
        />
      )}
    </>
  );
}
