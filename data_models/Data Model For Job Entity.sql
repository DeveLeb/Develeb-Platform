CREATE TABLE "Job" (
  "id" INTEGER PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "level_id" INTEGER NOT NULL,
  "category_id" INTEGER NOT NULL,
  "location" VARCHAR(255),
  "description" TEXT,
  "compensation" VARCHAR(255),
  "application_link" VARCHAR(255),
  "is_external" BOOLEAN DEFAULT false,
  "company_id" INTEGER,
  "created_at" TIMESTAMP DEFAULT (now()),
  "updated_at" TIMESTAMP DEFAULT (now())
);

CREATE TABLE "Job_Category" (
  "id" INTEGER PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL
);

CREATE TABLE "Job_Level" (
  "id" INTEGER PRIMARY KEY,
  "level_title" VARCHAR(255) NOT NULL
);

CREATE TABLE "Job_Views" (
  "id" INTEGER PRIMARY KEY,
  "job_id" INTEGER,
  "user_id" INTEGER,
  "last_viewed_at" TIMESTAMP DEFAULT (now())
);

ALTER TABLE "Job" ADD FOREIGN KEY ("level_id") REFERENCES "Job_Level" ("level_id");

ALTER TABLE "Job" ADD FOREIGN KEY ("category_id") REFERENCES "Job_Category" ("category_id");

ALTER TABLE "Job_Views" ADD FOREIGN KEY ("job_id") REFERENCES "Job" ("job_id");
