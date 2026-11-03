// shortcut: Shops have no photo column yet, so every Shop uses a fallback; add one when real photos exist.
// Picked from the id, so a Shop always gets the same image.
export function fallbackImage(shopId: number) {
  return `/fallbacks/${(shopId % 6) + 1}.svg`;
}
