import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { job, jobCategory, jobLevel, jobSaved } from 'src/db/schema';
import { logger } from 'src/server';

import { db } from '../../db';
import { Job, JobCategory, JobSchema, SavedJob } from './jobModel';
import { jobRepository } from './jobRepository';

// export const getJobs = async (req: Request, res: Response) => {
//   try {
//     const { pageIndex = '1', pageSize = '10', categoryId, levelId, companyName } = req.query;

//     const page = parseInt(pageIndex as string, 10) || 1;
//     const limit = parseInt(pageSize as string, 10) || 10;
//     const offset = (page - 1) * limit;

//     const conditions: SQL[] = [eq(job.isApproved, true)];

//     if (categoryId) {
//       conditions.push(eq(job.categoryId, parseInt(categoryId as string, 10)));
//     }

//     if (levelId) {
//       conditions.push(eq(job.levelId, parseInt(levelId as string, 10)));
//     }

//     if (companyName) {
//       conditions.push(like(company.name, `%${companyName as string}%`));
//     }

//     let baseQuery = db
//       .select()
//       .from(job)
//       .leftJoin(jobCategory, eq(job.categoryId, jobCategory.id))
//       .leftJoin(jobLevel, eq(job.levelId, jobLevel.id))
//       .leftJoin(company, eq(job.companyId, company.id));

//     if (conditions.length > 0) {
//       baseQuery = baseQuery.where(and(...conditions)) as typeof baseQuery;
//     }

//     const countQuery = db
//       .select({ count: sql<number>`count(*)` })
//       .from(job)
//       .leftJoin(jobCategory, eq(job.categoryId, jobCategory.id))
//       .leftJoin(jobLevel, eq(job.levelId, jobLevel.id))
//       .leftJoin(company, eq(job.companyId, company.id));

//     if (conditions.length > 0) {
//       countQuery.where(and(...conditions));
//     }

//     const finalQuery = baseQuery.limit(limit).offset(offset);

//     const [totalCount, result] = await Promise.all([countQuery.execute(), finalQuery.execute()]);

//     if (!totalCount || !result) {
//       throw new Error('Failed to fetch jobs');
//     }

//     if (result.length === 0) return res.status(404).json('No job found');

//     res.json({
//       data: result,
//       pagination: {
//         currentPage: page,
//         pageSize: limit,
//         totalCount: totalCount[0].count,
//         totalPages: Math.ceil(totalCount[0].count / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching jobs:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

export const jobService = {
  findJobById: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      const job = await jobRepository.findJobByIdAsync(id);
      if (!job) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Job found', job, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteJobById: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      const deleteJob = await jobRepository.deleteJobByIdAsync(id);
      if (!deleteJob) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Job deleted', deleteJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateJob: async (
    id: string,
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
  ): Promise<ServiceResponse<Job | null>> => {
    try {
      const updateJob = await jobRepository.updateJobAsync(
        id,
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
        tags,
        isApproved
      );
      return new ServiceResponse(ResponseStatus.Success, 'Job updated', updateJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  // findJobs: async (): Promise<ServiceResponse<Job[] | null>> => {},
  submitJobForApproval: async (
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
  ): Promise<ServiceResponse<Job | null>> => {
    try {
      const newJob = await jobRepository.createJobAsync(
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
        tags,
        isApproved
      );
      return new ServiceResponse(ResponseStatus.Success, 'Job created', newJob, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating job: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  approveJob: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      const findJob = await jobRepository.findJobByIdAsync(id);
      if (!findJob) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job not found', null, StatusCodes.NOT_FOUND);
      }

      if (findJob.is_approved) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job already approved', null, StatusCodes.CONFLICT);
      }
      const approvedJob = await db.update(job).set({ isApproved: true }).where(eq(job.id, id)).returning();
      return new ServiceResponse(
        ResponseStatus.Success,
        'Job approved',
        JobSchema.parse(approvedJob[0]),
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error approving job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  rejectJob: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      const findJob = await jobRepository.findJobByIdAsync(id);
      if (!findJob) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      const rejectedJob = await jobRepository.deleteJobByIdAsync(id);
      return new ServiceResponse(ResponseStatus.Success, 'Job rejected', JobSchema.parse(rejectedJob), StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error rejecting job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createJobCategory: async (title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const existingCategory = await db.select().from(jobCategory).where(eq(jobCategory.title, title)).limit(1);

      if (existingCategory.length > 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job category already exists', null, StatusCodes.CONFLICT);
      }

      const newCategory = await jobRepository.createJobCategoryAsync(title);
      return new ServiceResponse(ResponseStatus.Success, 'category created!', newCategory, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating job category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findJobCategory: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const category = await jobRepository.findCategoryByIdAsync(id);
      if (!category) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job category not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Job category found', category, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding job category with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateJobCategory: async (id: number, title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const category = await jobRepository.findCategoryByIdAsync(id);
      if (!category) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job category not found', null, StatusCodes.NOT_FOUND);
      }
      const updatedJobCategory = await jobRepository.updateJobCatergoryAsync(id, title);
      return new ServiceResponse(ResponseStatus.Success, 'Job category updated', updatedJobCategory, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating job category with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteJobCategory: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const category = await jobRepository.findCategoryByIdAsync(id);
      if (!category) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job category not found', null, StatusCodes.NOT_FOUND);
      }
      const deletedCategory = await jobRepository.deleteJobCategoryAsync(id);
      return new ServiceResponse(ResponseStatus.Success, 'Job category deleted', deletedCategory, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting job category with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createJobLevel: async (title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const existingLevel = await db.select().from(jobLevel).where(eq(jobLevel.title, title)).limit(1);

      if (existingLevel.length > 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job Level already exists', null, StatusCodes.CONFLICT);
      }

      const newLevel = await jobRepository.createJobLevelAsync(title);
      return new ServiceResponse(ResponseStatus.Success, 'Level created!', newLevel, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating job Level: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findJoblevel: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const level = await jobRepository.findLevelByIdAsync(id);
      if (!level) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Job level found', level, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding job level with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateJobLevel: async (id: number, title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const level = await jobRepository.findLevelByIdAsync(id);
      if (!level) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      const updatedJobLevel = await jobRepository.updateJobCatergoryAsync(id, title);
      return new ServiceResponse(ResponseStatus.Success, 'Job level updated', updatedJobLevel, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating job level with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteJobLevel: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      const level = await jobRepository.findLevelByIdAsync(id);
      if (!level) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      const deletedLevel = await jobRepository.deleteJobLevelAsync(id);
      return new ServiceResponse(ResponseStatus.Success, 'Job level deleted', deletedLevel, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting job level with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findCategories: async (): Promise<ServiceResponse<JobCategory[] | null>> => {
    try {
      const categories = await jobRepository.findCategoriesAsync();
      return new ServiceResponse(ResponseStatus.Success, 'Categories found', categories, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding categories: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findJobTotalViews: async (
    id: string
  ): Promise<ServiceResponse<{ job_id: string; totalViews: number | null } | null>> => {
    try {
      const totalViews = await jobRepository.findJobTotalViewsAsync(id);
      const data = { job_id: id, totalViews };
      return new ServiceResponse(ResponseStatus.Success, 'Total views found', data, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding total views: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  saveJob: async (jobId: string, userId: string): Promise<ServiceResponse<SavedJob | null>> => {
    try {
      const findJob = await jobRepository.findJobByIdAsync(jobId);
      if (!findJob) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      const searchJob = await db.select().from(jobSaved).where(eq(jobSaved.jobId, jobId));
      if (searchJob.length > 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job already saved', null, StatusCodes.CONFLICT);
      }

      const savedJob = await jobRepository.saveJobAsync(jobId, userId);
      return new ServiceResponse(ResponseStatus.Success, 'Job saved', savedJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving job with id ${jobId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
