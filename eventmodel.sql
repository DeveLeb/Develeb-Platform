CREATE TABLE "tags" (
  "id" serial PRIMARY KEY,
  "value" varchar(255) UNIQUE NOT NULL
);

CREATE TABLE "types" (
  "id" serial PRIMARY KEY,
  "value" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "event" (
  "id" integer PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "form_link" varchar(255) NOT NULL,
  "video_link" varchar(255) NOT NULL,
  "flyer" varchar(255),
  "date" datetime,
  "location" varchar(255),
  "speaker" varchar(255),
  "type_id" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);


CREATE TABLE "user_event_registration" (
  "user_id" integer,
  "event_id" integer,
  "primary" key(user_id,event_id)
);

CREATE TABLE "favorites_events" (
  "user_id" integer,
  "event_id" integer,
  "primary" key(user_id,event_id)
);

CREATE TABLE "event_tags" (
  "event_id" integer,
  "tag_id" integer,
  "primary" key(event_id,tag_id)
);

ALTER TABLE "event" ADD FOREIGN KEY ("type_id") REFERENCES "types" ("id");

ALTER TABLE "user_event_registration" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_event_registration" ADD FOREIGN KEY ("event_id") REFERENCES "event" ("id");

ALTER TABLE "favorites_events" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "favorites_events" ADD FOREIGN KEY ("event_id") REFERENCES "event" ("id");

ALTER TABLE "event_tags" ADD FOREIGN KEY ("event_id") REFERENCES "event" ("id");

ALTER TABLE "event_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");
