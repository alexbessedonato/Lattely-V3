import { createNeonAuth } from "@neon/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const secret = process.env.NEON_AUTH_COOKIE_SECRET;
if (!baseUrl || !secret) {
  throw new Error(
    "NEON_AUTH_BASE_URL or NEON_AUTH_COOKIE_SECRET is not set. `pnpm dev` reads the URL from .env.development and the secret from .env.local.",
  );
}

// Talks to Neon Auth, which keeps Members and their sessions on the Neon branch.
export const auth = createNeonAuth({ baseUrl, cookies: { secret } });

// The signed-in Member, or null for a Visitor who isn't signed in.
export async function getMember() {
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}
