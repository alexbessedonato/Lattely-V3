"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { Ranking, type RankedShop } from "@/components/ranking";
import { useLocationStore } from "@/lib/location/location-store";
import { getRankingNearMe } from "@/lib/ranking/ranking-near-me";
import { defaultRadiusM, filterParams } from "@/lib/ranking/search-params";

// The Ranking around the Visitor's own location. Only this browser knows the location,
// so it sends it to the server with the request and draws what comes back.
export function NearMeRanking() {
  const location = useLocationStore((state) => state.location);
  const [r] = useQueryState("r", filterParams.r);
  const radiusM = r ?? defaultRadiusM;
  const [ranking, setRanking] = useState<RankedShop[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!location) return; // still waiting for the browser to say where the Visitor is
    let isLatest = true;
    getRankingNearMe(location, radiusM).then(
      (ranking) => {
        // A slow answer for an older Radius mustn't replace a newer one.
        if (!isLatest) return;
        setRanking(ranking);
        setLoadFailed(false);
      },
      // The server couldn't load it (e.g. the database is down).
      () => {
        if (isLatest) setLoadFailed(true);
      },
    );
    return () => {
      isLatest = false;
    };
  }, [location, radiusM]);

  if (loadFailed) {
    return (
      <p role="alert" className="mt-4 font-semibold text-clay">
        Couldn&apos;t load shops near you — try again in a moment
      </p>
    );
  }
  if (!ranking) return <p className="mt-4">Finding Shops near you…</p>;
  return (
    <Ranking ranking={ranking} centre={{ near: "me" }} radiusM={radiusM} />
  );
}
