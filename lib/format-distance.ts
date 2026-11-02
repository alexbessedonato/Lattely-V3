// How a distance in metres is shown to Visitors: "810 m", "1 km", "1.2 km".
export function formatDistance(metres: number) {
  const roundedM = Math.round(metres / 10) * 10;
  if (roundedM < 1000) return `${roundedM} m`;
  return `${Number((metres / 1000).toFixed(1))} km`; // Number() drops a trailing ".0"
}
