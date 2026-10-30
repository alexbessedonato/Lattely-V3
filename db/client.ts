import { drizzle } from "drizzle-orm/postgres-js";

// The one database connection the app (and tests) use. Which database depends on DATABASE_URL.
export const db = drizzle(process.env.DATABASE_URL!);
