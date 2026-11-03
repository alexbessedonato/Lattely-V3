import {
  createLoader,
  createSerializer,
  parseAsNumberLiteral,
  parseAsString,
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

// The filter as it lives in the URL: `?n=gracia&r=1000`. Values that don't fit come back as null.
export const filterParams = {
  n: parseAsString, // a Neighbourhood's slug
  r: parseAsNumberLiteral(radiusOptionsM),
};

export const loadFilterParams = createLoader(filterParams);

// What the URL means, for the page and the filter box alike: an unknown slug is no Centre point,
// and with no Centre point there's no Radius either ("Anywhere").
// <N extends { slug: string }>: works for any Neighbourhood shape that has a slug, and hands that same shape back.
export function resolveFilter<N extends { slug: string }>(
  neighbourhoods: N[],
  { n, r }: { n: string | null; r: RadiusM | null },
) {
  const neighbourhood = neighbourhoods.find(
    (neighbourhood) => neighbourhood.slug === n,
  );
  if (!neighbourhood) return { neighbourhood, radiusM: null };
  return { neighbourhood, radiusM: r ?? defaultRadiusM };
}

// Builds a link's URL from filter values, e.g. { n: "gracia", r: 1000 } → "?n=gracia&r=1000".
export const serializeFilterParams = createSerializer(filterParams);
