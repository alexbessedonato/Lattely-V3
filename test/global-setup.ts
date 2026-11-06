import { createFreshDatabase } from "./fresh-database.ts";

// Runs once before all tests: gives them a brand-new, empty lattely_test database.
export default async function setup() {
  // Test files inherit this, so it's the one place the test database URL lives.
  process.env.DATABASE_URL = await createFreshDatabase("lattely_test");
}
