import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
  uniqueIndex,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    email: varchar("email", { length: 30 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 30 }),
    fullName: varchar("full_name", { length: 255 }),
    username: varchar("username", { length: 30 }).notNull().unique(),
    profileUrl: varchar("profile_url", { length: 255 }),
    levelId: integer("level_id"),
    categoryId: integer("category_id"),
    role: varchar("role", { length: 255 }).notNull(),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    tags: text("tags"),
  },
  (table) => ({
    userEmailIdx: index("user_email_idx").on(table.email),
    userLevelIdx: index("user_level_idx").on(table.levelId),
    userCategoryIdx: index("user_category_idx").on(table.categoryId),
  })
);

export const session = pgTable(
  "session",
  {
    id: integer("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    sessionCreatedAtIdx: index("session_created_at_idx").on(table.createdAt),
  })
);

export const job = pgTable(
  "job",
  {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    levelId: integer("level_id").notNull(),
    categoryId: integer("category_id").notNull(),
    typeId: integer("type_id").notNull(),
    location: varchar("location", { length: 255 }),
    description: text("description"),
    compensation: varchar("compensation", { length: 255 }),
    applicationLink: varchar("application_link", { length: 255 }),
    isExternal: boolean("is_external").default(false),
    companyId: integer("company_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    tags: text("tags"),
  },
  (table) => ({
    jobLevelIdx: index("job_level_idx").on(table.levelId),
    jobCategoryIdx: index("job_category_idx").on(table.categoryId),
    jobTypeIdx: index("job_type_idx").on(table.typeId),
    jobCompanyIdx: index("job_company_idx").on(table.companyId),
    jobCreatedAtIdx: index("job_created_at_idx").on(table.createdAt),
  })
);

export const jobCategory = pgTable(
  "job_category",
  {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
  },
  (table) => ({
    jobCategoryTitleIdx: uniqueIndex("job_category_title_idx").on(table.title),
  })
);

export const jobLevel = pgTable(
  "job_level",
  {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
  },
  (table) => ({
    jobLevelTitleIdx: uniqueIndex("job_level_title_idx").on(table.title),
  })
);

export const jobType = pgTable(
  "job_type",
  {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
  },
  (table) => ({
    jobTypeTitleIdx: uniqueIndex("job_type_title_idx").on(table.title),
  })
);

export const jobSaved = pgTable(
  "job_saved",
  {
    id: integer("id").primaryKey(),
    jobId: integer("job_id").notNull(),
    userId: integer("user_id"),
    savedAt: timestamp("saved_at").defaultNow(),
  },
  (table) => ({
    jobSavedJobIdx: index("job_saved_job_idx").on(table.jobId),
    jobSavedUserIdx: index("job_saved_user_idx").on(table.userId),
  })
);

export const jobViews = pgTable(
  "job_views",
  {
    id: integer("id").primaryKey(),
    jobId: integer("job_id").notNull(),
    userId: integer("user_id"),
    sessionId: integer("session_id"),
    lastViewedAt: timestamp("last_viewed_at").defaultNow(),
  },
  (table) => ({
    jobViewsJobIdx: index("job_views_job_idx").on(table.jobId),
    jobViewsUserIdx: index("job_views_user_idx").on(table.userId),
    jobViewsSessionIdx: index("job_views_session_idx").on(table.sessionId),
  })
);

export const event = pgTable(
  "event",
  {
    id: integer("id").primaryKey().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    videoLink: varchar("video_link", { length: 255 }).notNull(),
    flyerLink: varchar("flyer_link", { length: 255 }).notNull(),
    date: timestamp("date"),
    location: varchar("location", { length: 255 }),
    speakerName: varchar("speaker_name", { length: 255 }),
    speakerDescription: varchar("speaker_description", { length: 255 }),
    speakerProfileUrl: varchar("speaker_profile_url", { length: 255 }),
    typeId: integer("type_id"),
    tags: text("tags"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    eventDateIdx: index("event_date_idx").on(table.date),
    eventTypeIdx: index("event_type_idx").on(table.typeId),
  })
);

export const userEventRegistration = pgTable(
  "user_event_registration",
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id"),
    eventId: integer("event_id"),
    userType: varchar("user_type", { length: 255 }),
  },
  (table) => ({
    userEventRegUserIdx: index("user_event_reg_user_idx").on(table.userId),
    userEventRegEventIdx: index("user_event_reg_event_idx").on(table.eventId),
  })
);

export const eventSaved = pgTable(
  "event_saved",
  {
    id: integer("id").primaryKey(),
    eventId: integer("event_id").notNull(),
    userId: integer("user_id"),
    savedAt: timestamp("saved_at").defaultNow(),
  },
  (table) => ({
    eventSavedEventIdx: index("event_saved_event_idx").on(table.eventId),
    eventSavedUserIdx: index("event_saved_user_idx").on(table.userId),
  })
);

export const resource = pgTable(
  "resource",
  {
    id: integer("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    link: varchar("link", { length: 255 }).notNull(),
    publish: boolean("publish").default(false),
    type: varchar("type", { length: 255 }),
    tags: text("tags"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    resourceTitleIdx: index("resource_title_idx").on(table.title),
    resourceTypeIdx: index("resource_type_idx").on(table.type),
    resourcePublishIdx: index("resource_publish_idx").on(table.publish),
  })
);

export const resourceViews = pgTable(
  "resource_views",
  {
    id: integer("id").primaryKey(),
    userId: integer("user_id"),
    resourceId: integer("resource_id"),
    sessionId: integer("session_id"),
    lastViewedAt: timestamp("last_viewed_at").defaultNow(),
  },
  (table) => ({
    resourceViewsUserIdx: index("resource_views_user_idx").on(table.userId),
    resourceViewsResourceIdx: index("resource_views_resource_idx").on(
      table.resourceId
    ),
    resourceViewsSessionIdx: index("resource_views_session_idx").on(
      table.sessionId
    ),
  })
);

export const resourceSaved = pgTable(
  "resource_saved",
  {
    id: integer("id").primaryKey(),
    resourceId: integer("resource_id").notNull(),
    userId: integer("user_id"),
    savedAt: timestamp("saved_at").defaultNow(),
  },
  (table) => ({
    resourceSavedResourceIdx: index("resource_saved_resource_idx").on(
      table.resourceId
    ),
    resourceSavedUserIdx: index("resource_saved_user_idx").on(table.userId),
  })
);

export const company = pgTable(
  "company",
  {
    id: integer("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).unique(),
    description: text("description"),
    website: varchar("website", { length: 255 }).unique(),
    size: varchar("size", { length: 10 }),
    location: varchar("location", { length: 255 }),
    industry: varchar("industry", { length: 255 }),
    isVisible: boolean("is_visible").default(false),
    instagramUrl: varchar("intagram_url", { length: 255 }),
    facebookUrl: varchar("facebook_url", { length: 255 }),
    xUrl: varchar("x_url", { length: 255 }),
    linkedinUrl: varchar("linkedin_url", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    companyNameIdx: uniqueIndex("company_name_idx").on(table.name),
    companyWebsiteIdx: uniqueIndex("company_website_idx").on(table.website),
    companyIndustryIdx: index("company_industry_idx").on(table.industry),
    companyIsVisibleIdx: index("company_is_visible_idx").on(table.isVisible),
  })
);

export const companyFeedback = pgTable(
  "company_feedback",
  {
    id: integer("id").primaryKey().notNull(),
    companyId: integer("company_id"),
    userId: integer("user_id"),
    description: text("description"),
    approved: boolean("approved").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    companyFeedbackCompanyIdx: index("company_feedback_company_idx").on(
      table.companyId
    ),
    companyFeedbackUserIdx: index("company_feedback_user_idx").on(table.userId),
    companyFeedbackApprovedIdx: index("company_feedback_approved_idx").on(
      table.approved
    ),
  })
);

export const tags = pgTable(
  "tags",
  {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull().unique(),
  },
  (table) => ({
    tagsNameIdx: uniqueIndex("tags_name_idx").on(table.name),
  })
);

// Relation tables
export const userViewsJob = pgTable(
  "user_views_job",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => job.id),
    sessionId: integer("session_id").references(() => session.id),
    viewedAt: timestamp("viewed_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.jobId, t.sessionId),
  })
);

export const userRegistersForEvent = pgTable(
  "user_registers_for_event",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id),
    registeredAt: timestamp("registered_at").defaultNow(),
    userType: varchar("user_type", { length: 255 }),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.eventId),
  })
);

export const userViewsResource = pgTable(
  "user_views_resource",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    resourceId: integer("resource_id")
      .notNull()
      .references(() => resource.id),
    sessionId: integer("session_id").references(() => session.id),
    viewedAt: timestamp("viewed_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.resourceId, t.sessionId),
  })
);

export const userSavesJob = pgTable(
  "user_saves_job",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => job.id),
    savedAt: timestamp("saved_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.jobId),
  })
);

export const userSavesEvent = pgTable(
  "user_saves_event",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => event.id),
    savedAt: timestamp("saved_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.eventId),
  })
);

export const userSavesResource = pgTable(
  "user_saves_resource",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    resourceId: integer("resource_id")
      .notNull()
      .references(() => resource.id),
    savedAt: timestamp("saved_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.resourceId),
  })
);

export const userProvidesFeedbackToCompany = pgTable(
  "user_provides_feedback_to_company",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    companyId: integer("company_id")
      .notNull()
      .references(() => company.id),
    feedbackId: integer("feedback_id")
      .notNull()
      .references(() => companyFeedback.id),
    providedAt: timestamp("provided_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.companyId, t.feedbackId),
  })
);

export const sessionTracksJobView = pgTable(
  "session_tracks_job_view",
  {
    sessionId: integer("session_id")
      .notNull()
      .references(() => session.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => job.id),
    viewedAt: timestamp("viewed_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.sessionId, t.jobId),
  })
);

export const sessionTracksResourceView = pgTable(
  "session_tracks_resource_view",
  {
    sessionId: integer("session_id")
      .notNull()
      .references(() => session.id),
    resourceId: integer("resource_id")
      .notNull()
      .references(() => resource.id),
    viewedAt: timestamp("viewed_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey(t.sessionId, t.resourceId),
  })
);
