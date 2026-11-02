import {
  createLoader,
  createSerializer,
  parseAsNumberLiteral,
  parseAsString,
} from "nuqs/server";

// The Radius options in metres. "Anywhere" has no number: it's no `r` and no Centre point.
export const radiusOptionsM = [500, 1000, 2000, 5000] as const;
export type RadiusM = (typeof radiusOptionsM)[number];

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

// Builds a link's URL from filter values, e.g. { n: "gracia", r: 1000 } → "?n=gracia&r=1000".
export const serializeFilterParams = createSerializer(filterParams);
