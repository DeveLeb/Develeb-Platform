CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255),
  "password" VARCHAR(255),
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "phone_number" VARCHAR(20),
  "headline" VARCHAR(255) default NULL,
  "job_title" INTEGER,
  "level" INTEGER,
  "tags" VARCHAR(255),
  "created_at" timestamp default (now()),
  "profile_url" VARCHAR(255) default NULL,
  "role" VARCHAR(255) default "USER",
  "is_verified" boolean default FALSE,
  FOREIGN KEY (level) REFERENCES Job_Level(id),
  FOREIGN KEY (job_title) REFERENCES Job_Category(id)
);
