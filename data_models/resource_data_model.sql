CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "resource" (
  "id" INTEGER PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "link" VARCHAR(255) NOT NULL,
  "publish" BOOLEAN,
  "type" VARCHAR(255),
  "created_at" TIMESTAMP NOT NULL DEFAULT (now()),
  "updated_at" TIMESTAMP
);

CREATE TABLE "tag" (
  "id" INTEGER PRIMARY KEY,
  "tag_name" VARCHAR(255)
);

CREATE TABLE "resource_tag" (
  "resource_id" INTEGER,
  "tag_id" INTEGER,
  PRIMARY KEY ("resource_id", "tag_id"),
  FOREIGN KEY ("resource_id") REFERENCES "resource" ("id"),
  FOREIGN KEY ("tag_id") REFERENCES "tag" ("id")
)
CREATE TABLE "resource_view" (
  "id" INTEGER PRIMARY KEY,
  "user_id" INTEGER,
  "resource_id" INTEGER,
  "viewed_at" TIMESTAMP DEFAULT (now())
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

