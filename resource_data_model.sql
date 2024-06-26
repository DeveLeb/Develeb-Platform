CREATE TABLE "user" (
  "id" integer PRIMARY KEY,
  "username" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL
);

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

CREATE TABLE "favorite_resource" (
  "user_id" INTEGER,
  "resource_id" INTEGER,
  PRIMARY KEY ("user_id", "resource_id")
);

ALTER TABLE "resource_view" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "favorite_resource" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "resource_view" ADD FOREIGN KEY ("resource_id") REFERENCES "resource" ("id");

ALTER TABLE "favorite_resource" ADD FOREIGN KEY ("resource_id") REFERENCES "resource" ("id");

