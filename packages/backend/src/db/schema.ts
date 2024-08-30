import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 15 }).unique(),
  fullName: varchar('full_name', { length: 255 }),
  username: varchar('username', { length: 30 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  profileUrl: varchar('profile_url', { length: 255 }),
  levelId: integer('level_id').references(() => jobLevel.id),
  categoryId: integer('category_id').references(() => jobCategory.id),
  role: varchar('role', { length: 50 }).notNull().default('USER'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  tags: text('tags'),
});

export const session = pgTable('session', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const job = pgTable(
  'job',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    levelId: integer('level_id')
      .notNull()
      .references(() => jobLevel.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => jobCategory.id),
    typeId: integer('type_id')
      .notNull()
      .references(() => jobType.id),
    location: varchar('location', { length: 255 }),
    description: text('description'),
    compensation: varchar('compensation', { length: 255 }),
    applicationLink: varchar('application_link', { length: 255 }),
    isExternal: boolean('is_external').default(false),
    companyId: uuid('company_id').references(() => company.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    postedAt: timestamp('posted_at'),
    tags: text('tags'),
    isApproved: boolean('is_approved').default(false),
  },
  (table) => ({
    jobLevelIdx: index('job_level_idx').on(table.levelId),
    jobCategoryIdx: index('job_category_idx').on(table.categoryId),
    jobTypeIdx: index('job_type_idx').on(table.typeId),
    jobCompanyIdx: index('job_company_idx').on(table.companyId),
    jobCreatedAtIdx: index('job_created_at_idx').on(table.createdAt),
  })
);

export const jobCategory = pgTable(
  'job_category',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull().unique(),
  },
  (table) => ({
    jobCategoryTitleIdx: uniqueIndex('job_category_title_idx').on(table.title),
  })
);

export const jobLevel = pgTable(
  'job_level',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull().unique(),
  },
  (table) => ({
    jobLevelTitleIdx: uniqueIndex('job_level_title_idx').on(table.title),
  })
);

export const jobType = pgTable(
  'job_type',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull().unique(),
  },
  (table) => ({
    jobTypeTitleIdx: uniqueIndex('job_type_title_idx').on(table.title),
  })
);

export const jobSaved = pgTable(
  'job_saved',
  {
    id: serial('id').primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => job.id),
    userId: uuid('user_id').references(() => user.id),
    savedAt: timestamp('saved_at').defaultNow(),
  },
  (table) => ({
    jobSavedJobIdx: index('job_saved_job_idx').on(table.jobId),
    jobSavedUserIdx: index('job_saved_user_idx').on(table.userId),
  })
);

export const jobViews = pgTable(
  'job_views',
  {
    id: serial('id').primaryKey(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => job.id),
    userId: uuid('user_id').references(() => user.id),
    sessionId: uuid('session_id').references(() => session.id),
    lastViewedAt: timestamp('last_viewed_at').defaultNow(),
  },
  (table) => ({
    jobViewsJobIdx: index('job_views_job_idx').on(table.jobId),
    jobViewsUserIdx: index('job_views_user_idx').on(table.userId),
    jobViewsSessionIdx: index('job_views_session_idx').on(table.sessionId),
  })
);

export const event = pgTable('event', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  videoLink: varchar('video_link', { length: 255 }).notNull(),
  flyerLink: varchar('flyer_link', { length: 255 }).notNull(),
  date: timestamp('date'),
  location: varchar('location', { length: 255 }),
  speakerName: varchar('speaker_name', { length: 255 }),
  speakerDescription: varchar('speaker_description', { length: 255 }),
  speakerProfileUrl: varchar('speaker_profile_url', { length: 255 }),
  locationType: varchar('location_type', { length: 30 }),
  tags: text('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const userEventRegistration = pgTable(
  'user_event_registration',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').references(() => user.id),
    eventId: uuid('event_id').references(() => event.id),
    userType: varchar('user_type', { length: 255 }),
  },
  (table) => ({
    userEventRegUserIdx: index('user_event_reg_user_idx').on(table.userId),
    userEventRegEventIdx: index('user_event_reg_event_idx').on(table.eventId),
  })
);

export const eventSaved = pgTable(
  'event_saved',
  {
    id: serial('id').primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => event.id),
    userId: uuid('user_id').references(() => user.id),
    savedAt: timestamp('saved_at').defaultNow(),
  },
  (table) => ({
    eventSavedEventIdx: index('event_saved_event_idx').on(table.eventId),
    eventSavedUserIdx: index('event_saved_user_idx').on(table.userId),
  })
);

export const resource = pgTable('resource', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  link: varchar('link', { length: 255 }).notNull(),
  publish: boolean('publish').default(false),
  type: varchar('type', { length: 255 }),
  tags: text('tags'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const resourceViews = pgTable(
  'resource_views',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id').references(() => user.id),
    resourceId: uuid('resource_id').references(() => resource.id),
    sessionId: uuid('session_id').references(() => session.id),
    lastViewedAt: timestamp('last_viewed_at').defaultNow(),
  },
  (table) => ({
    resourceViewsUserIdx: index('resource_views_user_idx').on(table.userId),
    resourceViewsResourceIdx: index('resource_views_resource_idx').on(table.resourceId),
    resourceViewsSessionIdx: index('resource_views_session_idx').on(table.sessionId),
  })
);

export const resourceSaved = pgTable(
  'resource_saved',
  {
    id: serial('id').primaryKey(),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resource.id),
    userId: uuid('user_id').references(() => user.id),
    savedAt: timestamp('saved_at').defaultNow(),
  },
  (table) => ({
    resourceSavedResourceIdx: index('resource_saved_resource_idx').on(table.resourceId),
    resourceSavedUserIdx: index('resource_saved_user_idx').on(table.userId),
  })
);

export const company = pgTable(
  'company',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).unique(),
    description: text('description'),
    website: varchar('website', { length: 255 }).unique(),
    size: varchar('size', { length: 10 }),
    location: varchar('location', { length: 255 }),
    industry: varchar('industry', { length: 255 }),
    isVisible: boolean('is_visible').default(false),
    instagramUrl: varchar('intagram_url', { length: 255 }),
    facebookUrl: varchar('facebook_url', { length: 255 }),
    xUrl: varchar('x_url', { length: 255 }),
    linkedinUrl: varchar('linkedin_url', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    companyNameIdx: uniqueIndex('company_name_idx').on(table.name),
    companyWebsiteIdx: uniqueIndex('company_website_idx').on(table.website),
    companyIndustryIdx: index('company_industry_idx').on(table.industry),
    companyIsVisibleIdx: index('company_is_visible_idx').on(table.isVisible),
  })
);

export const companyFeedback = pgTable(
  'company_feedback',
  {
    id: serial('id').primaryKey(),
    companyId: uuid('company_id').references(() => company.id),
    userId: uuid('user_id').references(() => user.id),
    description: text('description'),
    approved: boolean('approved').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    companyFeedbackCompanyIdx: index('company_feedback_company_idx').on(table.companyId),
    companyFeedbackUserIdx: index('company_feedback_user_idx').on(table.userId),
    companyFeedbackApprovedIdx: index('company_feedback_approved_idx').on(table.approved),
  })
);

export const tags = pgTable(
  'tags',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
  },
  (table) => ({
    tagsNameIdx: uniqueIndex('tags_name_idx').on(table.name),
  })
);
