import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// The address of database `name` in the Docker Postgres from docker-compose.yml.
export function dockerDatabaseUrl(name: string) {
  return `postgres://postgres:postgres@localhost:5433/${name}`;
}

// Deletes the Docker database `name` if it exists, makes it again empty, and returns its URL.
export async function createFreshDatabase(name: string) {
  // Connect to the built-in `postgres` database, since you can't delete the one you're connected to.
  const admin = postgres(dockerDatabaseUrl("postgres"), {
    onnotice: () => {}, // hide "database does not exist, skipping" on the first run
  });
  await admin`DROP DATABASE IF EXISTS ${admin(name)} WITH (FORCE)`;
  await admin`CREATE DATABASE ${admin(name)}`;
  await admin.end();

  // Build the empty database with the same migrations dev and production use.
  const url = dockerDatabaseUrl(name);
  const db = drizzle(url);
  await migrate(db, { migrationsFolder: "./drizzle" });
  await db.$client.end();
  return url;
}
