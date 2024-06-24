CREATE TABLE "resource" (
  "id" integer PRIMARY KEY,
  "title" varchar(255) NOT NULL,
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

CREATE TABLE "resource_tags" (
  "resource_id" integer NOT NULL,
  "tag_id" integer NOT NULL,
  PRIMARY KEY ("resource_id", "tag_id")
);

CREATE TABLE "resource_views" (
  "user_id" integer PRIMARY KEY,
  "resource_id" integer,
  "total_views" integer,
  "last_viewed_at" timestamp DEFAULT (now())
);

ALTER TABLE "resource_tags" ADD FOREIGN KEY ("resource_id") REFERENCES "resource" ("id") ON DELETE CASCADE;

ALTER TABLE "resource_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;

ALTER TABLE "resource_views" ADD FOREIGN KEY ("resource_id") REFERENCES "resource" ("id");
