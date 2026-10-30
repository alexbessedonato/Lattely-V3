import { defineConfig } from "drizzle-kit";

// A DATABASE_URL already set (e.g. Neon in production) wins over this file.
process.loadEnvFile(".env.development");

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
