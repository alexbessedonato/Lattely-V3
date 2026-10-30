CREATE TYPE "public"."shop_status" AS ENUM('submission', 'live', 'closed');--> statement-breakpoint
CREATE TABLE "shops" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shops_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"address" text NOT NULL,
	"link" text,
	"status" "shop_status" NOT NULL,
	CONSTRAINT "shops_slug_unique" UNIQUE("slug")
);
