CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar(255),
  "password" varchar(255),
  "first_name" varchar(255),
  "last_name" varchar(255),
  "phone_number" varchar(20),
  "headline" varchar(255),
  "job_title" varchar(255),
  "level" varchar(255),
  "created_at" timestamp default (now()),
  "profile_url" varchar(255) default NULL,
  "is_admin" boolean default FALSE,
  "is_verified" boolean default FALSE,
  FOREIGN KEY (level) REFERENCES Job_Level(id),
  FOREIGN KEY (job_title) REFERENCES Job_Category(id)
);
