import type { Point } from "@/lib/ranking";

// The browser's location API answers through callbacks; this turns it into a Promise you can await.
// It rejects if the Visitor says no or the browser can't find them.
export function getBrowserLocation() {
  return new Promise<Point>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ x: coords.longitude, y: coords.latitude }),
      reject,
    );
  });
}
