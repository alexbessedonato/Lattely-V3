import { Suspense } from "react";
import { Filters } from "@/components/filters";
import { NearMeRanking } from "@/components/near-me-ranking";
import { Ranking } from "@/components/ranking";
import { getNeighbourhoods } from "@/lib/neighbourhoods";
import { getRanking } from "@/lib/ranking";
import { loadFilterParams, resolveFilter } from "@/lib/search-params";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-md px-5 pb-10">
      <h1 className="flex h-16 items-center font-heading text-2xl font-bold">
        Lattely
      </h1>

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
