CREATE TABLE IF NOT EXISTS "event_location_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	CONSTRAINT "event_location_type_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "event" RENAME COLUMN "type_id" TO "location_type_id";--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_type_id_job_type_id_fk";
--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "is_approved" SET DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_location_type_id_event_location_type_id_fk" FOREIGN KEY ("location_type_id") REFERENCES "public"."event_location_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;