CREATE TABLE "Job" (
  "job_id" INTEGER PRIMARY KEY,
  "title" VARCHAR NOT NULL,
  "level_id" INTEGER NOT NULL,
  "category_id" INTEGER NOT NULL,
  "location" VARCHAR,
  "description" TEXT,
  "compensation" VARCHAR,
  "application_link" VARCHAR,
  "is_external" BOOLEAN DEFAULT false,
  "company_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT (now()),
  "updated_at" TIMESTAMP DEFAULT (now())
);

CREATE TABLE "Job_Category" (
  "category_id" INTEGER PRIMARY KEY,
  "category_title" VARCHAR NOT NULL
);

CREATE TABLE "Job_Level" (
  "level_id" INTEGER PRIMARY KEY,
  "level_title" VARCHAR NOT NULL
);

CREATE TABLE "Job_Views" (
  "view_id" INTEGER PRIMARY KEY,
  "job_id" INTEGER,
  "total_views" INTEGER,
  "last_viewed_at" TIMESTAMP DEFAULT (now())
);

ALTER TABLE "Job" ADD FOREIGN KEY ("level_id") REFERENCES "Job_Level" ("level_id");

ALTER TABLE "Job" ADD FOREIGN KEY ("category_id") REFERENCES "Job_Category" ("category_id");

ALTER TABLE "Job_Views" ADD FOREIGN KEY ("job_id") REFERENCES "Job" ("job_id");
