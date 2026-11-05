import { auth } from "@/lib/auth-server";

// Coming back from Google, the URL carries a one-time neon_auth_session_verifier. This swaps it
// for the session cookie, then reloads the page without it. Browsing never needs signing in, so
// every page is public.
export default auth.middleware({ publicRoutes: ["/"] });

export const config = {
  // Only the return trip from Google, so ordinary page loads skip this entirely.
  matcher: [
    {
      source: "/:path*",
      has: [{ type: "query", key: "neon_auth_session_verifier" }],
    },
  ],
};
