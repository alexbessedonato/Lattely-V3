import { create } from "zustand";

// The email a Visitor is signing in with, and the page to open afterwards, carried from /sign-in to /sign-in/code.
// It lives only in this browser tab: never in the URL, so the email stays out of history and logs.
export const useUserContextStore = create<{
  email: string | null;
  next: string | null;
  setSignIn: (email: string, next: string | null) => void;
}>((set) => ({
  email: null,
  next: null,
  setSignIn: (email, next) => set({ email, next }),
}));
