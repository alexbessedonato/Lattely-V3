"use client";

import { useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";
import { formatDistance } from "@/lib/format-distance";
import { filterParams, radiusOptionsM } from "@/lib/search-params";

export function Filters({
  neighbourhoods,
}: {
  neighbourhoods: { name: string; slug: string }[];
}) {
  const [{ n, r }, setFilter] = useQueryStates(filterParams, {
    shallow: false, // ask the server to redraw the Ranking for the new filter
    history: "push", // each change gets its own Back step
  });
  // Same rules as the page: an unknown slug is no Centre point, and a Centre point with no Radius is 1 km.
  const neighbourhood = neighbourhoods.find(
    (neighbourhood) => neighbourhood.slug === n,
  );
  const hasCentrePoint = neighbourhood !== undefined;
  const radiusM = hasCentrePoint ? (r ?? 1000) : null;

  return (
    <section
      aria-label="Filters"
      className="mt-4 flex flex-col gap-3.5 rounded-[20px] border border-latte bg-paper p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="neighbourhood"
          className="text-sm font-semibold text-mocha"
        >
          Neighbourhood
        </label>
        <select
          id="neighbourhood"
          value={neighbourhood?.slug ?? ""}
          onChange={(event) =>
            // Picking a Neighbourhood starts at 1 km; "All of Barcelona" clears both.
            setFilter(
              event.target.value
                ? { n: event.target.value, r: 1000 }
                : { n: null, r: null },
            )
          }
          className="h-11.5 rounded-full border border-latte bg-white px-4"
        >
          <option value="">All of Barcelona</option>
          {neighbourhoods.map((neighbourhood) => (
            <option key={neighbourhood.slug} value={neighbourhood.slug}>
              {neighbourhood.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <span id="radius-label" className="text-sm font-semibold text-mocha">
          How far will you walk?
        </span>
        <div
          role="group"
          aria-labelledby="radius-label"
          className="flex flex-wrap gap-2"
        >
          {radiusOptionsM.map((option) => (
            <RadiusButton
              key={option}
              label={formatDistance(option)}
              pressed={radiusM === option}
              disabled={!hasCentrePoint} // a Radius needs a Centre point to measure from
              onClick={() => setFilter({ r: option })}
            />
          ))}
          <RadiusButton
            label="Anywhere"
            pressed={radiusM === null}
            disabled={hasCentrePoint} // only available with no Centre point
          />
        </div>
      </div>
    </section>
  );
}

function RadiusButton({
  label,
  pressed,
  disabled,
  onClick,
}: {
  label: string;
  pressed: boolean;
  disabled: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="h-11 rounded-full border-latte bg-white px-3.5 text-sm text-espresso disabled:border-dashed aria-pressed:border-espresso aria-pressed:bg-espresso aria-pressed:font-semibold aria-pressed:text-cream"
    >
      {label}
    </Button>
  );
}
