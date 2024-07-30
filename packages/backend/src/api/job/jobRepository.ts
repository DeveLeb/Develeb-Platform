import { and, count, eq, like, SQL, sql } from 'drizzle-orm';
import { company, job, jobCategory, jobLevel, jobSaved, jobViews } from 'src/db/schema';

import { db } from '../../db';
import { Job, JobSavedSchema, JobSchema, SavedJob } from '../job/jobModel';
import { CreateJobRequest, PutJobRequest } from './jobRequest';
import { JobCategory, JobCategorySchema, JobLevel, JobLevelSchema } from './jobResponse';

export const jobRepository = {
  findJobsAsync: async (filters: {
    limit: number;
    offset: number;
    categoryId?: number;
    levelId?: number;
    companyName?: string;
  }): Promise<{ jobs: Job[]; totalCount: number }> => {
    const conditions: SQL[] = [eq(job.isApproved, true)];

    if (filters.categoryId !== undefined) {
      conditions.push(eq(job.categoryId, filters.categoryId));
    }
    if (filters.levelId !== undefined) {
      conditions.push(eq(job.levelId, filters.levelId));
    }
    if (filters.companyName) {
      conditions.push(like(company.name, `%${filters.companyName}%`));
    }

    const baseQuery = db
      .select()
      .from(job)
      .leftJoin(jobCategory, eq(job.categoryId, jobCategory.id))
      .leftJoin(jobLevel, eq(job.levelId, jobLevel.id))
      .leftJoin(company, eq(job.companyId, company.id))
      .where(and(...conditions));

    const [totalCountResult, result] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(baseQuery.as('subquery')),
      baseQuery.limit(filters.limit).offset(filters.offset).execute(),
    ]);

    const parsedJobs = result.map((row: any) => {
      const jobData = {
        ...row.job,
        categoryTitle: row.job_category?.title,
        levelTitle: row.job_level?.title,
        companyName: row.company?.name,
      };
      return JobSchema.parse(jobData);
    });

    return {
      jobs: parsedJobs,
      totalCount: Number(totalCountResult[0].count),
    };
  },

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
    const jobData = {
      ...row.job,
      categoryTitle: row.job_category?.title,
      levelTitle: row.job_level?.title,
      companyName: row.company?.name,
    };
    return JobSchema.parse(jobData);
  },
  findSavedJobAsync: async (jobId: string, userId: string): Promise<SavedJob | null> => {
    const result = await db
      .select()
      .from(jobSaved)
      .where(and(eq(jobSaved.jobId, jobId), eq(jobSaved.userId, userId)))
      .limit(1);

    return result.length > 0 ? JobSavedSchema.parse(result[0]) : null;
  },
  deleteJobByIdAsync: async (id: string): Promise<Job | null> => {
    const result = await db.delete(job).where(eq(job.id, id)).returning();
    return result.length > 0 ? JobSchema.parse(result[0]) : null;
  },

  updateJobAsync: async (id: string, updateJobRequest: PutJobRequest): Promise<Job | null> => {
    const updateJob = await db
      .update(job)
      .set({
        ...updateJobRequest,
        updatedAt: new Date(),
      })
      .where(eq(job.id, id))
      .returning();
    return updateJob.length > 0 ? JobSchema.parse(updateJob[0]) : null;
  },

  createJobAsync: async (createJobRequest: CreateJobRequest, isAdmin: boolean): Promise<Job | null> => {
    const createdJob = await db
      .insert(job)
      .values({ ...createJobRequest, isApproved: isAdmin })
      .returning();
    return createdJob.length > 0 ? JobSchema.parse(createdJob[0]) : null;
  },

  findJobTotalViewsAsync: async (id: string): Promise<number | null> => {
    const result = await db.select({ totalViews: count() }).from(jobViews).where(eq(jobViews.jobId, id));
    return result.length > 0 ? result[0].totalViews : null;
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

  findCategoryByIdAsync: async (id: number): Promise<JobCategory | null> => {
    const result = await db.select().from(jobCategory).where(eq(jobCategory.id, id)).limit(1);
    return result.length > 0 ? JobCategorySchema.parse(result[0]) : null;
  },

  findCategoriesAsync: async (): Promise<JobCategory[]> => {
    const result = await db.select().from(jobCategory);
    return JobCategorySchema.array().parse(result);
  },

  createJobCategoryAsync: async (title: string): Promise<JobCategory | null> => {
    const createCategory = await db.insert(jobCategory).values({ title }).returning();
    return createCategory.length > 0 ? JobCategorySchema.parse(createCategory[0]) : null;
  },

  updateJobCatergoryAsync: async (id: number, title: string): Promise<JobCategory | null> => {
    const updateCategory = await db.update(jobCategory).set({ title }).where(eq(jobCategory.id, id)).returning();
    return updateCategory.length > 0 ? JobCategorySchema.parse(updateCategory[0]) : null;
  },

  deleteJobCategoryAsync: async (id: number): Promise<JobCategory | null> => {
    const deleteCategory = await db.delete(jobCategory).where(eq(jobCategory.id, id)).returning();
    return deleteCategory.length > 0 ? JobCategorySchema.parse(deleteCategory[0]) : null;
  },

  findLevelByIdAsync: async (id: number): Promise<JobCategory | null> => {
    const result = await db.select().from(jobLevel).where(eq(jobLevel.id, id)).limit(1);
    return result.length > 0 ? JobCategorySchema.parse(result[0]) : null;
  },

  findLevelsAsync: async (): Promise<JobLevel[] | null> => {
    const result = await db.select().from(jobLevel);
    return JobLevelSchema.array().parse(result);
  },

  createJobLevelAsync: async (title: string): Promise<JobCategory | null> => {
    const createJobLevel = await db.insert(jobLevel).values({ title }).returning();
    return createJobLevel.length > 0 ? JobCategorySchema.parse(createJobLevel[0]) : null;
  },

  updateJobLevelAsync: async (id: number, title: string): Promise<JobCategory | null> => {
    const updateLevel = await db.update(jobLevel).set({ title }).where(eq(jobLevel.id, id)).returning();
    return updateLevel.length > 0 ? JobCategorySchema.parse(updateLevel[0]) : null;
  },

  deleteJobLevelAsync: async (id: number): Promise<JobCategory | null> => {
    const deleteLevel = await db.delete(jobLevel).where(eq(jobLevel.id, id)).returning();
    return deleteLevel.length > 0 ? JobCategorySchema.parse(deleteLevel[0]) : null;
  },

  findSavedJobsAsync: async (userId: string): Promise<Job[] | null> => {
    const result = await db
      .select({
        job: job,
      })
      .from(job)
      .leftJoin(jobSaved, eq(jobSaved.jobId, job.id))
      .where(eq(jobSaved.userId, userId));

    return result.length > 0 ? result.map((row) => JobSchema.parse(row.job)) : null;
  },
};
