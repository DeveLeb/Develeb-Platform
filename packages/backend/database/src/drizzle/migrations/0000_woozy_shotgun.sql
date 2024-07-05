CREATE TABLE IF NOT EXISTS "company" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"description" text,
	"website" varchar(255),
	"size" varchar(10),
	"location" varchar(255),
	"industry" varchar(255),
	"is_visible" boolean DEFAULT false,
	"intagram_url" varchar(255),
	"facebook_url" varchar(255),
	"x_url" varchar(255),
	"linkedin_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_name_unique" UNIQUE("name"),
	CONSTRAINT "company_website_unique" UNIQUE("website")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company_feedback" (
	"id" integer PRIMARY KEY NOT NULL,
	"company_id" integer,
	"user_id" integer,
	"description" text,
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"video_link" varchar(255) NOT NULL,
	"flyer_link" varchar(255) NOT NULL,
	"date" timestamp,
	"location" varchar(255),
	"speaker_name" varchar(255),
	"speaker_description" varchar(255),
	"speaker_profile_url" varchar(255),
	"type_id" integer,
	"tags" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_saved" (
	"id" integer PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer,
	"saved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"level_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"type_id" integer NOT NULL,
	"location" varchar(255),
	"description" text,
	"compensation" varchar(255),
	"application_link" varchar(255),
	"is_external" boolean DEFAULT false,
	"company_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"tags" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_category" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_level" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_saved" (
	"id" integer PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"user_id" integer,
	"saved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_type" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_views" (
	"id" integer PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"user_id" integer,
	"session_id" integer,
	"last_viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resource" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"link" varchar(255) NOT NULL,
	"publish" boolean DEFAULT false,
	"type" varchar(255),
	"tags" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resource_saved" (
	"id" integer PRIMARY KEY NOT NULL,
	"resource_id" integer NOT NULL,
	"user_id" integer,
	"saved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resource_views" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer,
	"resource_id" integer,
	"session_id" integer,
	"last_viewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_tracks_job_view" (
	"session_id" integer NOT NULL,
	"job_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now(),
	CONSTRAINT "session_tracks_job_view_session_id_job_id_pk" PRIMARY KEY("session_id","job_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_tracks_resource_view" (
	"session_id" integer NOT NULL,
	"resource_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now(),
	CONSTRAINT "session_tracks_resource_view_session_id_resource_id_pk" PRIMARY KEY("session_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(30) NOT NULL,
	"phone_number" varchar(30),
	"full_name" varchar(255),
	"username" varchar(30) NOT NULL,
	"profile_url" varchar(255),
	"level_id" integer,
	"category_id" integer,
	"role" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"tags" text,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_event_registration" (
	"id" integer PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_id" integer,
	"user_type" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_provides_feedback_to_company" (
	"user_id" varchar(255) NOT NULL,
	"company_id" integer NOT NULL,
	"feedback_id" integer NOT NULL,
	"provided_at" timestamp DEFAULT now(),
	CONSTRAINT "user_provides_feedback_to_company_user_id_company_id_feedback_id_pk" PRIMARY KEY("user_id","company_id","feedback_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_registers_for_event" (
	"user_id" varchar(255) NOT NULL,
	"event_id" integer NOT NULL,
	"registered_at" timestamp DEFAULT now(),
	"user_type" varchar(255),
	CONSTRAINT "user_registers_for_event_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_saves_event" (
	"user_id" varchar(255) NOT NULL,
	"event_id" integer NOT NULL,
	"saved_at" timestamp DEFAULT now(),
	CONSTRAINT "user_saves_event_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_saves_job" (
	"user_id" varchar(255) NOT NULL,
	"job_id" integer NOT NULL,
	"saved_at" timestamp DEFAULT now(),
	CONSTRAINT "user_saves_job_user_id_job_id_pk" PRIMARY KEY("user_id","job_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_saves_resource" (
	"user_id" varchar(255) NOT NULL,
	"resource_id" integer NOT NULL,
	"saved_at" timestamp DEFAULT now(),
	CONSTRAINT "user_saves_resource_user_id_resource_id_pk" PRIMARY KEY("user_id","resource_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_views_job" (
	"user_id" varchar(255) NOT NULL,
	"job_id" integer NOT NULL,
	"session_id" integer,
	"viewed_at" timestamp DEFAULT now(),
	CONSTRAINT "user_views_job_user_id_job_id_session_id_pk" PRIMARY KEY("user_id","job_id","session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_views_resource" (
	"user_id" varchar(255) NOT NULL,
	"resource_id" integer NOT NULL,
	"session_id" integer,
	"viewed_at" timestamp DEFAULT now(),
	CONSTRAINT "user_views_resource_user_id_resource_id_session_id_pk" PRIMARY KEY("user_id","resource_id","session_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_tracks_job_view" ADD CONSTRAINT "session_tracks_job_view_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_tracks_job_view" ADD CONSTRAINT "session_tracks_job_view_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_tracks_resource_view" ADD CONSTRAINT "session_tracks_resource_view_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_tracks_resource_view" ADD CONSTRAINT "session_tracks_resource_view_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_provides_feedback_to_company" ADD CONSTRAINT "user_provides_feedback_to_company_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_provides_feedback_to_company" ADD CONSTRAINT "user_provides_feedback_to_company_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_provides_feedback_to_company" ADD CONSTRAINT "user_provides_feedback_to_company_feedback_id_company_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."company_feedback"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_registers_for_event" ADD CONSTRAINT "user_registers_for_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_registers_for_event" ADD CONSTRAINT "user_registers_for_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_saves_event" ADD CONSTRAINT "user_saves_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_saves_event" ADD CONSTRAINT "user_saves_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_saves_job" ADD CONSTRAINT "user_saves_job_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_saves_job" ADD CONSTRAINT "user_saves_job_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_saves_resource" ADD CONSTRAINT "user_saves_resource_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_saves_resource" ADD CONSTRAINT "user_saves_resource_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_views_job" ADD CONSTRAINT "user_views_job_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_views_job" ADD CONSTRAINT "user_views_job_job_id_job_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_views_job" ADD CONSTRAINT "user_views_job_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_views_resource" ADD CONSTRAINT "user_views_resource_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_views_resource" ADD CONSTRAINT "user_views_resource_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_views_resource" ADD CONSTRAINT "user_views_resource_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "company_name_idx" ON "company" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "company_website_idx" ON "company" USING btree ("website");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_industry_idx" ON "company" USING btree ("industry");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_is_visible_idx" ON "company" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_feedback_company_idx" ON "company_feedback" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_feedback_user_idx" ON "company_feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "company_feedback_approved_idx" ON "company_feedback" USING btree ("approved");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_date_idx" ON "event" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_type_idx" ON "event" USING btree ("type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_saved_event_idx" ON "event_saved" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_saved_user_idx" ON "event_saved" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_level_idx" ON "job" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_category_idx" ON "job" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_type_idx" ON "job" USING btree ("type_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_company_idx" ON "job" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_created_at_idx" ON "job" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_category_title_idx" ON "job_category" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_level_title_idx" ON "job_level" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_saved_job_idx" ON "job_saved" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_saved_user_idx" ON "job_saved" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "job_type_title_idx" ON "job_type" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_views_job_idx" ON "job_views" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_views_user_idx" ON "job_views" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_views_session_idx" ON "job_views" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_title_idx" ON "resource" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_type_idx" ON "resource" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_publish_idx" ON "resource" USING btree ("publish");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_saved_resource_idx" ON "resource_saved" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_saved_user_idx" ON "resource_saved" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_views_user_idx" ON "resource_views" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_views_resource_idx" ON "resource_views" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_views_session_idx" ON "resource_views" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_created_at_idx" ON "session" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_level_idx" ON "user" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_category_idx" ON "user" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_event_reg_user_idx" ON "user_event_registration" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_event_reg_event_idx" ON "user_event_registration" USING btree ("event_id");