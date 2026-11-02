-- Edited by hand: drizzle-kit leaves out the SRID, so 4326 (GPS longitude/latitude) is added below.
CREATE TABLE "neighbourhoods" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "neighbourhoods_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"centre" geometry(point, 4326) NOT NULL,
	CONSTRAINT "neighbourhoods_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "location" geometry(point, 4326);