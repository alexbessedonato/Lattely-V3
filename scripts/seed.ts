// Fills the dev database with a few live Shops so the home page has something to show.
import { drizzle } from "drizzle-orm/postgres-js";
import { shops } from "../db/schema.ts";

// Own connection: plain `node` can't resolve `@/` imports, so @/db/client isn't usable here.
const db = drizzle(process.env.DATABASE_URL!);

await db
  .insert(shops)
  .values([
    {
      name: "Satan's Coffee Corner",
      slug: "satans-coffee-corner",
      address: "Carrer de l'Arc de Sant Ramon del Call, 11",
      status: "live",
    },
    {
      name: "Nømad Coffee Lab",
      slug: "nomad-coffee-lab",
      address: "Passatge Sert, 12",
      instagramOrWebsite: "https://nomadcoffee.es",
      status: "live",
    },
    {
      name: "SlowMov",
      slug: "slowmov",
      address: "Carrer de Luis Antúnez, 18",
      status: "live",
    },
    {
      name: "Onna Coffee",
      slug: "onna-coffee",
      address: "Carrer de Santa Teresa, 1",
      status: "live",
    },
  ])
  // Safe to run again: Shops whose slug already exists are skipped.
  .onConflictDoNothing();

await db.$client.end();
console.log("Seeded Shops.");
