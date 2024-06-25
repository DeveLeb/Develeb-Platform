CREATE TABLE "resource" (
  "id" integer PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "tag_ids" integer[],
  "description" TEXT,
  "link" varchar(255) NOT NULL,
  "publish" boolean,
  "type" varchar(255),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "tag" (
  "id" integer PRIMARY KEY,
  "tag_name" varchar(255)
);

CREATE TABLE "resource_view" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "resource_id" integer,
  "viewed_at" timestamp DEFAULT (now())
);

ALTER TABLE "resource_view" ADD FOREIGN KEY ("resource_id") REFERENCES "resource" ("id");
