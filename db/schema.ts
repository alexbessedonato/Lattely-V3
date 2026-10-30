import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const shopStatus = pgEnum("shop_status", [
  "submission",
  "live",
  "closed",
]);

export const shops = pgTable("shops", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  address: text().notNull(),
  link: text(),
  status: shopStatus().notNull(),
});
