import { defineConfig, devices } from "@playwright/test";
import { dockerDatabaseUrl } from "./test/fresh-database.ts";

// The development Neon Auth URL, and from .env.local the cookie secret and the test Member's login.
process.loadEnvFile(".env.development");
process.loadEnvFile(".env.local");

const port = 3001; // beside `pnpm dev` on 3000, which can't run twice in one project

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: `http://localhost:${port}`, ...devices["Pixel 7"] }, // Lattely is designed for phones
  webServer: {
    // A production build of the app on its own fresh, seeded database. Slower than `next dev`, but it never touches your dev data.
    command: `node e2e/setup-database.ts && node scripts/seed.ts && next build && next start -p ${port}`,
    port,
    timeout: 180_000,
    env: {
      DATABASE_URL: dockerDatabaseUrl("lattely_e2e"),
      // Set here, so `next build` uses the development Neon Auth and not the production one in .env.production.
      NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL!,
    },
  },
});
