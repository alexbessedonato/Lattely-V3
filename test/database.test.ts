import postgres from "postgres";
import { afterAll, expect, test } from "vitest";

const sql = postgres(process.env.DATABASE_URL!);
afterAll(() => sql.end());

test("tests connect to a database with PostGIS", async () => {
  const [row] = await sql`SELECT postgis_lib_version() AS version`;
  expect(row.version).toMatch(/^3\.5/);
});
