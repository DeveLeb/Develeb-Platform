CREATE TABLE "event" (
  "event_id" integer PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "tags" varchar,
  "description" text,
  "form_link" varchar NOT NULL,
  "video_link" varchar NOT NULL,
  "flyer" varchar,
  "date" datetime,
  "location" varchar,
  "speaker" varchar,
  "type" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);
