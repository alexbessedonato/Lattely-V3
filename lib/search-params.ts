import { createLoader, parseAsNumberLiteral, parseAsString } from "nuqs/server";

// The Radius options in metres. "Anywhere" has no number: it's no `r` and no Centre point.
export const radiusOptionsM = [500, 1000, 2000, 5000] as const;

// The filter as it lives in the URL: `?n=gracia&r=1000`. Values that don't fit come back as null.
export const filterParams = {
  n: parseAsString, // a Neighbourhood's slug
  r: parseAsNumberLiteral(radiusOptionsM),
};

export const loadFilterParams = createLoader(filterParams);
