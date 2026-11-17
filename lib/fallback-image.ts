// The drawing a Shop shows when it has no photo. Picked from the id, so a Shop always gets the same one.
export function fallbackImage(shopId: number) {
  return `/fallbacks/${(shopId % 6) + 1}.svg`;
}
