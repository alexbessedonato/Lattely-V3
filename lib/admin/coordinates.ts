// "41.3851, 2.1734" (latitude, longitude, as Google Maps copies them) → { x: longitude, y: latitude }.
// Null if it isn't two numbers, or the point isn't around Barcelona, which also catches a swapped pair.
export function parseCoordinates(text: string) {
  const parts = text.split(",");
  if (parts.length !== 2) return null;

  const [latitude, longitude] = parts.map((part) => Number(part.trim()));
  const inBarcelona =
    latitude >= 41.2 &&
    latitude <= 41.6 &&
    longitude >= 1.9 &&
    longitude <= 2.4;
  return inBarcelona ? { x: longitude, y: latitude } : null;
}
