"use client";

import { MapPin } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getBrowserLocation } from "@/lib/location/browser-location";
import { formatDistance } from "@/lib/format-distance";
import { useLocationStore } from "@/lib/location/location-store";
import {
  defaultRadiusM,
  filterParams,
  radiusOptionsM,
  resolveFilter,
} from "@/lib/ranking/search-params";

export function Filters({
  neighbourhoods,
}: {
  neighbourhoods: { name: string; slug: string }[];
}) {
  const [{ n, near, r }, setFilter] = useQueryStates(filterParams, {
    shallow: false, // ask the server to redraw the Ranking for the new filter
    history: "push",
  });

  const { neighbourhood, nearMe, radiusM } = resolveFilter(neighbourhoods, {
    n,
    near,
    r,
  });

  const hasCentrePoint = neighbourhood !== undefined || nearMe;
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const [locationFailed, setLocationFailed] = useState(false);

  function askForLocation() {
    getBrowserLocation().then(
      (location) => {
        setLocation(location);
        setLocationFailed(false);
        // Already near=me (a shared link, or asking again): the URL is right, so don't add a Back step.
        if (!nearMe) setFilter({ n: null, near: "me", r: defaultRadiusM });
      },
      // Denied, or the browser couldn't find the Visitor: the current results stay.
      () => {
        setLocationFailed(true);
        // A shared near=me link has no results yet, so show all of Barcelona. Replace: Back shouldn't ask again.
        if (nearMe && !location) {
          setFilter({ near: null, r: null }, { history: "replace" });
        }
      },
    );
  }

  // Always calls this render's askForLocation, without being a reason for the effect to rerun.
  const askOnOpen = useEffectEvent(() => askForLocation());

  useEffect(() => {
    if (nearMe && !location) askOnOpen();
  }, [nearMe, location]);

  const neighbourhoodOptions = [
    { value: null, label: "All of Barcelona" },
    ...neighbourhoods.map(({ name, slug }) => ({ value: slug, label: name })),
  ];

  return (
    <section
      aria-label="Filters"
      className="mt-4 flex flex-col gap-3.5 rounded-[20px] border border-latte bg-paper p-4"
    >
      <div className="flex items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Label
            htmlFor="neighbourhood"
            className="font-semibold text-mocha mb-2"
          >
            Neighbourhood
          </Label>

          <Select
            items={neighbourhoodOptions} // lets the trigger show the picked name, not its slug
            value={neighbourhood?.slug ?? null}
            onValueChange={(slug) => {
              setLocationFailed(false); // they've picked, so the "pick a neighbourhood" message is done
              // Picking a Neighbourhood starts at the default Radius; "All of Barcelona" clears both.
              setFilter(
                slug
                  ? { n: slug, near: null, r: defaultRadiusM }
                  : { n: null, near: null, r: null },
              );
            }}
          >
            <SelectTrigger
              id="neighbourhood"
              className="w-full rounded-full bg-white pr-4 pl-4 text-base data-[size=default]:h-11"
            >
              {/* With Near me there's no Neighbourhood, but null would read "All of Barcelona" */}
              <SelectValue>
                {nearMe ? "Pick a neighbourhood" : undefined}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {neighbourhoodOptions.map((option) => (
                <SelectItem
                  key={option.label}
                  value={option.value}
                  className="py-2.5 text-base"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          aria-pressed={nearMe}
          onClick={askForLocation}
          className="h-11 rounded-full border-input bg-white px-4 text-base font-semibold aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:[&_svg]:text-primary-foreground"
        >
          <MapPin className="size-4.5 text-clay" aria-hidden />
          Near me
        </Button>
      </div>

      {locationFailed && (
        // role="alert": screen readers read it out as soon as it appears
        <p role="alert" className="text-sm font-semibold text-clay">
          Couldn&apos;t get your location — pick a neighbourhood instead
        </p>
      )}

      <div className="flex flex-col gap-2">
        {/* Same spacing as the Neighbourhood Label: it's a span because it names a group, not one input */}
        <span
          id="radius-label"
          className="text-sm leading-none font-semibold text-mocha mb-2"
        >
          How far will you walk?
        </span>

        <ToggleGroup
          aria-labelledby="radius-label"
          variant="outline"
          className="flex-wrap"
          // Values are strings; "anywhere" stands for no Radius.
          value={[radiusM === null ? "anywhere" : String(radiusM)]}
          onValueChange={([picked]) => {
            // Clicking the pressed one un-presses it (picked is undefined): keep the Radius instead.
            const option = radiusOptionsM.find((m) => String(m) === picked);
            if (option) setFilter({ r: option });
          }}
        >
          {radiusOptionsM.map((option) => (
            <RadiusItem
              key={option}
              value={String(option)}
              disabled={!hasCentrePoint} // a Radius needs a Centre point to measure from
            >
              {formatDistance(option)}
            </RadiusItem>
          ))}

          <RadiusItem
            value="anywhere"
            disabled={hasCentrePoint} // only available with no Centre point
          >
            Anywhere
          </RadiusItem>
        </ToggleGroup>
      </div>
    </section>
  );
}

function RadiusItem(props: React.ComponentProps<typeof ToggleGroupItem>) {
  return (
    <ToggleGroupItem
      className="h-11 rounded-full bg-white px-3.5 disabled:border-dashed aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:font-semibold aria-pressed:text-primary-foreground"
      {...props}
    />
  );
}
