// Run by Playwright before it starts the app: a brand-new lattely_e2e database, so every run starts from the same Shops and Ratings.
// `node` runs this directly, so imports are relative (it can't resolve `@/`).
import { createFreshDatabase } from "../test/fresh-database.ts";

await createFreshDatabase("lattely_e2e");
