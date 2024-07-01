CREATE TABLE "tags" (
  "id" INTEGER PRIMARY KEY,
  "value" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE "types" (
  "id" INTEGER PRIMARY KEY,
  "value" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "event" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "form_link" VARCHAR(255) NOT NULL,
  "video_link" VARCHAR(255) NOT NULL,
  "flyer" VARCHAR(255),
  "date" DATETIME,
  "location" VARCHAR(255),
  "speaker" VARCHAR(255),
  "type_id" INTEGER,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);


CREATE TABLE "user_event_registration" (
  "user_id" INTEGER,
  "event_id" INTEGER,
  "primary" key(user_id,event_id)
);

CREATE TABLE "favorites_events" (
  "user_id" INTEGER,
  "event_id" INTEGER,
  "primary" key(user_id,event_id)
);

CREATE TABLE "event_tags" (
  "event_id" INTEGER,
  "tag_id" INTEGER,
  "primary" key(event_id,tag_id)
);

ALTER TABLE "event" ADD FOREIGN KEY ("type_id") REFERENCES "types" ("id");

ALTER TABLE "user_event_registration" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_event_registration" ADD FOREIGN KEY ("event_id") REFERENCES "event" ("id");

ALTER TABLE "favorites_events" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "favorites_events" ADD FOREIGN KEY ("event_id") REFERENCES "event" ("id");

ALTER TABLE "event_tags" ADD FOREIGN KEY ("event_id") REFERENCES "event" ("id");

ALTER TABLE "event_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");
