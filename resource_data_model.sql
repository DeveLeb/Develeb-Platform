CREATE TABLE "resources" (
  "resourceId" integer PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "tags" varchar(255)[],
  "description" TEXT,
  "link" varchar(1000) NOT NULL,
  "publish" boolean,
  "type" varchar(100),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "resource_views" (
  "viewId" integer PRIMARY KEY,
  "resourceId" integer NOT NULL,
  "view_count" integer DEFAULT 0,
  "last_viewed_date" timestamp DEFAULT (now())
);

ALTER TABLE "resource_views" ADD FOREIGN KEY ("resourceId") REFERENCES "resources" ("resourceId");
