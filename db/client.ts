import { drizzle } from "drizzle-orm/postgres-js";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL is not set. `pnpm dev` reads it from .env.development; production builds need it set in the environment.",
  );
}

// The one database connection the app (and tests) use. Which database depends on DATABASE_URL.
export const db = drizzle(url);
