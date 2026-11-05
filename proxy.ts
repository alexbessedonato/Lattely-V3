import { auth } from "@/lib/auth-server";

// Coming back from Google, the URL carries a one-time neon_auth_session_verifier. This swaps it
// for the session cookie, then reloads the page without it. Google always returns to "/", and
// listing it as public means a failed swap still shows the Ranking instead of the sign-in page.
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
