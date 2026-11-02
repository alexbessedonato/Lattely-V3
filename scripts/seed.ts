// Fills a database with Neighbourhoods and a few real, live Shops so the home page has something to show.
// Also run on Neon `production`, so only add real Shops here, never fake test data.
import { inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { neighbourhoods, ratings, shops } from "../db/schema.ts";

// Own connection: plain `node` can't resolve `@/` imports, so @/db/client isn't usable here.
const db = drizzle(process.env.DATABASE_URL!);

await db
  .insert(shops)
  .values([
    {
      name: "Satan's Coffee Corner",
      slug: "satans-coffee-corner",
      address: "Carrer de l'Arc de Sant Ramon del Call, 11",
      location: { x: 2.1747, y: 41.3826 },
      status: "live",
    },
    {
      name: "Nømad Coffee Lab",
      slug: "nomad-coffee-lab",
      address: "Passatge Sert, 12",
      location: { x: 2.1786, y: 41.3889 },
      instagramOrWebsite: "https://nomadcoffee.es",
      status: "live",
    },
    {
      name: "SlowMov",
      slug: "slowmov",
      address: "Carrer de Luis Antúnez, 18",
      location: { x: 2.1555, y: 41.3984 },
      status: "live",
    },
    {
      name: "Onna Coffee",
      slug: "onna-coffee",
      address: "Carrer de Santa Teresa, 1",
      location: { x: 2.1597, y: 41.3963 },
      status: "live",
    },
  ])
  // Safe to run again: a Shop whose slug already exists only gets its location updated.
  .onConflictDoUpdate({
    target: shops.slug,
    set: { location: sql`excluded.location` },
  });

console.log("Seeded Shops.");

// Centre points are hand-picked, roughly the middle of each Neighbourhood. x is longitude, y latitude.
await db
  .insert(neighbourhoods)
  .values([
    {
      name: "Barceloneta",
      slug: "barceloneta",
      centre: { x: 2.189, y: 41.3807 },
    },
    {
      name: "Barri Gòtic",
      slug: "barri-gotic",
      centre: { x: 2.1765, y: 41.383 },
    },
    { name: "El Born", slug: "el-born", centre: { x: 2.1817, y: 41.3851 } },
    { name: "El Clot", slug: "el-clot", centre: { x: 2.188, y: 41.41 } },
    { name: "El Raval", slug: "el-raval", centre: { x: 2.1685, y: 41.38 } },
    {
      name: "Eixample Dret",
      slug: "eixample-dret",
      centre: { x: 2.17, y: 41.395 },
    },
    {
      name: "Eixample Esquerre",
      slug: "eixample-esquerre",
      centre: { x: 2.156, y: 41.388 },
    },
    { name: "Fort Pienc", slug: "fort-pienc", centre: { x: 2.183, y: 41.396 } },
    { name: "Gràcia", slug: "gracia", centre: { x: 2.1565, y: 41.4025 } },
    { name: "Horta", slug: "horta", centre: { x: 2.16, y: 41.43 } },
    { name: "Les Corts", slug: "les-corts", centre: { x: 2.13, y: 41.385 } },
    { name: "Poble-sec", slug: "poble-sec", centre: { x: 2.163, y: 41.373 } },
    { name: "Poblenou", slug: "poblenou", centre: { x: 2.2, y: 41.4 } },
    {
      name: "Sagrada Família",
      slug: "sagrada-familia",
      centre: { x: 2.1744, y: 41.4036 },
    },
    {
      name: "Sant Antoni",
      slug: "sant-antoni",
      centre: { x: 2.1625, y: 41.3785 },
    },
    {
      name: "Sant Gervasi",
      slug: "sant-gervasi",
      centre: { x: 2.142, y: 41.402 },
    },
    { name: "Sants", slug: "sants", centre: { x: 2.136, y: 41.376 } },
    { name: "Sarrià", slug: "sarria", centre: { x: 2.121, y: 41.399 } },
    {
      name: "Vila Olímpica",
      slug: "vila-olimpica",
      centre: { x: 2.197, y: 41.389 },
    },
  ])
  // Safe to run again: a Neighbourhood whose slug already exists gets its name and centre updated.
  .onConflictDoUpdate({
    target: neighbourhoods.slug,
    set: { name: sql`excluded.name`, centre: sql`excluded.centre` },
  });

console.log("Seeded Neighbourhoods.");

// Sample Ratings are fake, so they only go into a database on this computer, never Neon.
if (new URL(process.env.DATABASE_URL!).hostname === "localhost") {
  // Stars from each sample Member, per Shop slug. Onna has none, so it shows as Unrated.
  const sampleStars: Record<string, number[]> = {
    "nomad-coffee-lab": [5, 5, 4, 5, 4, 5],
    "satans-coffee-corner": [5, 4, 4, 5],
    slowmov: [4, 3, 4],
  };

  const seededShops = await db
    .select({ id: shops.id, slug: shops.slug })
    .from(shops)
    .where(inArray(shops.slug, Object.keys(sampleStars)));

  await db
    .insert(ratings)
    .values(
      seededShops.flatMap((shop) =>
        sampleStars[shop.slug].map((stars, i) => ({
          memberId: `sample-member-${i + 1}`,
          shopId: shop.id,
          stars,
        })),
      ),
    )
    // Safe to run again: a Member's existing Rating for a Shop is skipped.
    .onConflictDoNothing();

  console.log("Seeded sample Ratings.");
}

await db.$client.end();
