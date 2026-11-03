import {
  createLoader,
  createSerializer,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

// The Radius options in metres. "Anywhere" has no number: it's no `r` and no Centre point.
export const radiusOptionsM = [500, 1000, 2000, 5000] as const;
export type RadiusM = (typeof radiusOptionsM)[number];

// The Radius a Centre point starts with when the URL has no `r`.
export const defaultRadiusM = 1000;

// The next Radius option up, or null after 5 km (only "Anywhere" is wider, and it needs no Centre point).
export function widerRadius(radiusM: RadiusM) {
  return radiusOptionsM[radiusOptionsM.indexOf(radiusM) + 1] ?? null;
}

// The filter as it lives in the URL: `?n=gracia&r=1000` or `?near=me&r=1000`. Values that don't fit come back as null.
export const filterParams = {
  n: parseAsString, // a Neighbourhood's slug
  near: parseAsStringLiteral(["me"]), // the Visitor's own location, which never goes in the URL (ADR-0002)
  r: parseAsNumberLiteral(radiusOptionsM),
};

export const loadFilterParams = createLoader(filterParams);

// What the URL means, for the page and the filter box alike: `near=me` or a known slug is the Centre point,
// an unknown slug is no Centre point, and with no Centre point there's no Radius either ("Anywhere").
// <N extends { slug: string }>: works for any Neighbourhood shape that has a slug, and hands that same shape back.
export function resolveFilter<N extends { slug: string }>(
  neighbourhoods: N[],
  { n, near, r }: { n: string | null; near: "me" | null; r: RadiusM | null },
) {
  const nearMe = near === "me";
  // There's at most one Centre point, so near=me wins over a slug.
  const neighbourhood = nearMe
    ? undefined
    : neighbourhoods.find((neighbourhood) => neighbourhood.slug === n);
  if (!nearMe && !neighbourhood) {
    return { neighbourhood, nearMe, radiusM: null };
  }
  return { neighbourhood, nearMe, radiusM: r ?? defaultRadiusM };
}

// Builds a link's URL from filter values, e.g. { n: "gracia", r: 1000 } → "?n=gracia&r=1000".
export const serializeFilterParams = createSerializer(filterParams);
