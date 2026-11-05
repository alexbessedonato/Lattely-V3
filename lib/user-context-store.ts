import { create } from "zustand";

// The email a Visitor is signing in with, carried from /sign-in to /sign-in/code.
// It lives only in this browser tab: never in the URL, so it stays out of history and logs.
export const useUserContextStore = create<{
  email: string | null;
  setEmail: (email: string) => void;
}>((set) => ({
  email: null,
  setEmail: (email) => set({ email: email }),
}));
