import { sql } from "drizzle-orm";
import {
  check,
  geometry,
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
} from "drizzle-orm/pg-core";

export const shopStatus = pgEnum("shop_status", [
  "pending",
  "live",
  "rejected",
  "closed",
]);

export const shops = pgTable("shops", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  address: text().notNull(),
  instagramOrWebsite: text("instagram_or_website"),
  status: shopStatus().notNull(),
  // Longitude (x) and latitude (y). Null until we know where the Shop is; such Shops only show with no Centre point.
  location: geometry({ type: "point", mode: "xy", srid: 4326 }),
});

export const neighbourhoods = pgTable("neighbourhoods", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  // Longitude (x) and latitude (y) of the Neighbourhood's Centre point.
  centre: geometry({ type: "point", mode: "xy", srid: 4326 }).notNull(),
});

export const ratings = pgTable(
  "ratings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // shortcut: plain text until Members exist; make it a foreign key when sign-in lands.
    memberId: text("member_id").notNull(),
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id),
    stars: integer().notNull(),
  },
  (table) => [
    unique().on(table.memberId, table.shopId), // one Rating per Member per Shop
    check("stars_1_to_5", sql`${table.stars} between 1 and 5`),
  ],
);
