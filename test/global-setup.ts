import postgres from "postgres";

// Runs once before all tests: gives them a brand-new, empty lattely_test database.
export default async function setup() {
  // Test files inherit this, so it's the one place the test database URL lives.
  process.env.DATABASE_URL =
    "postgres://postgres:postgres@localhost:5433/lattely_test";

  const admin = postgres(
    "postgres://postgres:postgres@localhost:5433/postgres",
    {
      onnotice: () => {}, // hide "database does not exist, skipping" on the first run
    },
  );
  await admin`DROP DATABASE IF EXISTS lattely_test WITH (FORCE)`;
  await admin`CREATE DATABASE lattely_test`;
  await admin.end();

  const sql = postgres(process.env.DATABASE_URL);
  await sql`CREATE EXTENSION postgis`;
  await sql.end();
}
