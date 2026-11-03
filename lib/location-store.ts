import { create } from "zustand";
import type { Point } from "@/lib/ranking";

// The Visitor's own location. It lives only in this browser tab: never in the URL, never stored (ADR-0002).
export const useLocationStore = create<{
  location: Point | null;
  setLocation: (location: Point) => void;
}>((set) => ({
  location: null,
  setLocation: (location) => set({ location: location }),
}));
