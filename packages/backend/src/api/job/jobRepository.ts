import { and, count, eq, SQL, sql } from 'drizzle-orm';
import { company, job, jobCategory, jobLevel, jobSaved, jobViews } from 'src/db/schema';

import { db } from '../../db';
import { Job, JobCategory, JobCategorySchema, JobSavedSchema, JobSchema, SavedJob } from '../job/jobModel';
import { UpdateJobRequest } from './jobRequests';

export const jobRepository = {
  findJobsAsync: async (conditions: SQL[], limit: number, offset: number): Promise<Job[]> => {
    let baseQuery = db
      .select()
      .from(job)
      .leftJoin(jobCategory, eq(job.categoryId, jobCategory.id))
      .leftJoin(jobLevel, eq(job.levelId, jobLevel.id))
      .leftJoin(company, eq(job.companyId, company.id));

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as typeof baseQuery;
    }
    const result = await baseQuery.limit(limit).offset(offset).execute();
    const parsedJobs = result.map((row) => {
      const jobData = {
        ...row.job,
        categoryTitle: row.job_category?.title,
        levelTitle: row.job_level?.title,
        companyName: row.company?.name,
      };
      const parsed = JobSchema.parse(jobData);
      return parsed;
    });

    return parsedJobs;
  },
  /////////////////////////////////////
  findJobsCountAsync: async (conditions: SQL[]): Promise<number> => {
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(job)
      .leftJoin(jobCategory, eq(job.categoryId, jobCategory.id))
      .leftJoin(jobLevel, eq(job.levelId, jobLevel.id))
      .leftJoin(company, eq(job.companyId, company.id));

    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }

    const result = await countQuery.execute();
    return result[0]?.count ?? 0;
  },

  ////////////////////////////////////////////////////

  findJobByIdAsync: async (id: string): Promise<Job | null> => {
    const result = await db
      .select()
      .from(job)
      .leftJoin(jobCategory, eq(job.categoryId, jobCategory.id))
      .leftJoin(jobLevel, eq(job.levelId, jobLevel.id))
      .leftJoin(company, eq(job.companyId, company.id))
      .where(eq(job.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Extract and structure the job data
    const jobData = {
      ...row.job,
      categoryTitle: row.job_category?.title,
      levelTitle: row.job_level?.title,
      companyName: row.company?.name,
    };
    const parsedJob = JobSchema.parse(jobData) || null;
    return parsedJob;
  },

  deleteJobByIdAsync: async (id: string): Promise<Job | null> => {
    const result = await db.delete(job).where(eq(job.id, id));
    if (result.length === 0) return null;

    return JobSchema.parse(result[0]) || null;
  },

  updateJobAsync: async (id: string, updateJobRequest: UpdateJobRequest): Promise<Job> => {
    const updateJob = await db.update(job).set(updateJobRequest).where(eq(job.id, id)).returning();

    return JobSchema.parse(updateJob[0]);
  },

  createJobAsync: async (
    title: string,
    levelId: number,
    categoryId: number,
    typeId: number,
    location: string,
    description: string,
    compensation: string,
    applicationLink: string,
    isExternal: boolean,
    companyId: string,
    tags: string,
    isApproved: boolean
  ): Promise<Job | null> => {
    const createdJob = await db
      .insert(job)
      .values({
        title,
        levelId,
        categoryId,
        typeId,
        location,
        description,
        compensation,
        applicationLink,
        isExternal,
        companyId,
        createdAt: new Date(),
        postedAt: new Date(),
        tags,
        isApproved,
      })
      .returning();

    return JobSchema.parse(createdJob[0]);
  },

  findJobTotalViewsAsync: async (id: string): Promise<number | null> => {
    const result = await db.select({ totalViews: count() }).from(jobViews).where(eq(jobViews.jobId, id));

    return result[0].totalViews || null;
  },

  saveJobAsync: async (jobId: string, userId: string): Promise<SavedJob> => {
    const jobToSaved = await db
      .insert(jobSaved)
      .values({
        userId,
        jobId,
      })
      .returning();

    return JobSavedSchema.parse(jobToSaved[0]);
  },

  ///////////////////////////////////////////////////////////////

  findCategoryByIdAsync: async (id: number): Promise<JobCategory | null> => {
    const result = await db.select().from(jobCategory).where(eq(jobCategory.id, id)).limit(1);
    if (result.length === 0) return null;

    return JobCategorySchema.parse(result[0]) || null;
  },

  findCategoriesAsync: async (): Promise<JobCategory[]> => {
    const result = await db.select().from(jobCategory);
    return JobCategorySchema.array().parse(result);
  },

  createJobCategoryAsync: async (title: string): Promise<JobCategory | null> => {
    const createCategory = await db.insert(jobCategory).values({ title }).returning();

    return JobCategorySchema.parse(createCategory[0]) || null;
  },

  updateJobCatergoryAsync: async (id: number, title: string): Promise<JobCategory> => {
    const updateCategory = await db.update(jobCategory).set({ title }).where(eq(jobCategory.id, id)).returning();

    return JobCategorySchema.parse(updateCategory[0]);
  },
  deleteJobCategoryAsync: async (id: number): Promise<JobCategory> => {
    const deleteCategory = await db.delete(jobCategory).where(eq(jobCategory.id, id)).returning();
    return JobCategorySchema.parse(deleteCategory[0]);
  },
  /////////////////////////////////////////////////////////////////////////
  findLevelByIdAsync: async (id: number): Promise<JobCategory | null> => {
    const result = await db.select().from(jobLevel).where(eq(jobLevel.id, id)).limit(1);
    if (result.length === 0) return null;

    return JobCategorySchema.parse(result[0]) || null;
  },

  findLevelsAsync: async (): Promise<JobCategory[] | null> => {
    const result = await db.select().from(jobLevel);
    return JobCategorySchema.array().parse(result);
  },
  createJobLevelAsync: async (title: string): Promise<JobCategory> => {
    const createJobLevel = await db.insert(jobLevel).values({ title }).returning();

    return JobCategorySchema.parse(createJobLevel[0]);
  },

  updateJobLevelAsync: async (id: number, title: string): Promise<JobCategory> => {
    const updateLevel = await db.update(jobLevel).set({ title }).where(eq(jobLevel.id, id)).returning();

    return JobCategorySchema.parse(updateLevel[0]);
  },
  deleteJobLevelAsync: async (id: number): Promise<JobCategory> => {
    const deleteLevel = await db.delete(jobLevel).where(eq(jobLevel.id, id)).returning();
    return JobCategorySchema.parse(deleteLevel[0]);
  },
};
