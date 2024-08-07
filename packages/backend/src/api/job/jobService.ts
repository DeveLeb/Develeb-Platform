import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';

import { Job, SavedJob } from './jobModel';
import { jobRepository } from './jobRepository';
import { CreateJobRequest, PutJobRequest } from './jobRequest';
import { JobCategory, JobLevel } from './jobResponse';

export const jobService = {
  findJobs: async (filters: {
    pageIndex: number;
    pageSize: number;
    categoryId?: number;
    levelId?: number;
    companyName?: string;
  }): Promise<ServiceResponse<Job[] | null>> => {
    logger.info(`Fetching jobs with filters: ${JSON.stringify(filters)}`);
    const { pageIndex, pageSize, categoryId, levelId, companyName } = filters;
    const offset = (pageIndex - 1) * pageSize;
    try {
      const { jobs, totalCount } = await jobRepository.findJobsAsync({
        limit: pageSize,
        offset,
        categoryId,
        levelId,
        companyName,
      });
      if (jobs.length === 0) {
        return new ServiceResponse(ResponseStatus.Success, 'No jobs found', null, StatusCodes.NOT_FOUND);
      }
      const totalPages = Math.ceil(totalCount / pageSize);
      const paginationInfo = {
        currentPage: pageIndex,
        pageSize,
        totalCount,
        totalPages,
      };
      const successMessage = `Jobs fetched successfully. Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}. Total jobs: ${paginationInfo.totalCount}.`;
      logger.info(successMessage);
      return new ServiceResponse(ResponseStatus.Success, successMessage, jobs, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error fetching jobs: ${error}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findJobById: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      logger.info(`Finding job with id ${id}`);
      const job = await jobRepository.findJobByIdAsync(id);
      logger.info(`Job found: ${JSON.stringify(job)}`);
      if (!job) {
        logger.info(`Job not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('Job found');
      return new ServiceResponse(ResponseStatus.Success, 'Job found', job, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteJobById: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      logger.info(`Deleting job with id ${id}`);
      const findJob = await jobRepository.findJobByIdAsync(id);
      logger.info(`Job found: ${JSON.stringify(findJob)}`);
      if (!findJob) {
        logger.info(`Job not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      const deleteJob = await jobRepository.deleteJobByIdAsync(id);
      logger.info(`Job deleted with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job deleted', deleteJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateJob: async (id: string, updateJobrequest: PutJobRequest): Promise<ServiceResponse<Job | null>> => {
    logger.info(`Updating job with id ${id}`);
    const job = await jobRepository.findJobByIdAsync(id);
    if (!job) {
      logger.info(`Job not found with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
    }
    try {
      logger.info(`Updating job with data: ${JSON.stringify(updateJobrequest)}`);
      const updateJob = await jobRepository.updateJobAsync(id, updateJobrequest);
      logger.info(`Job updated successfully with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job updated', updateJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating job with id ${id}:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  submitJobForApproval: async (
    createJobRequest: CreateJobRequest,
    isAdmin: boolean
  ): Promise<ServiceResponse<Job | null>> => {
    try {
      logger.info(`Creating job with data: ${JSON.stringify(createJobRequest)}`);
      const newJob = await jobRepository.createJobAsync(createJobRequest, isAdmin);
      if (!newJob) {
        return new ServiceResponse(ResponseStatus.Failed, 'Job creation failed', null, StatusCodes.BAD_REQUEST);
      }
      logger.info(`Job created successfully with id ${newJob.id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job created', newJob, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating job: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  approveJob: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      logger.info(`Approving job with id ${id}`);
      const findJob = await jobRepository.findJobByIdAsync(id);
      logger.info(`Find job result: ${JSON.stringify(findJob)}`);
      if (!findJob) {
        logger.info(`Job not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
      }

      if (findJob.isApproved) {
        logger.info(`Job already approved with id ${id}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Job already approved', null, StatusCodes.CONFLICT);
      }
      const approvedJob = await jobRepository.approveJobAsync(id);
      logger.info(`Approved job result: ${JSON.stringify(approvedJob)}`);
      logger.info(`Job approved successfully with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job approved', approvedJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error approving job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  rejectJob: async (id: string): Promise<ServiceResponse<Job | null>> => {
    try {
      logger.info(`Rejecting job with id ${id}`);
      logger.info('Beginning job rejection process');
      const findJob = await jobRepository.findJobByIdAsync(id);
      logger.info(`Job found: ${JSON.stringify(findJob)}`);
      if (!findJob) {
        logger.info(`Job not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      const rejectedJob = await jobRepository.deleteJobByIdAsync(id);
      logger.info(`Job rejected with id ${id}`);
      logger.info(`Job rejection process complete`);
      return new ServiceResponse(ResponseStatus.Success, 'Job rejected', rejectedJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error rejecting job with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createJobCategory: async (title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Creating job category with title ${title}`);
      const existingCategory = await jobRepository.findCategorybyTitleAsync(title);
      if (existingCategory) {
        logger.info(`Job category already exists with title ${title}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Job category already exists', null, StatusCodes.CONFLICT);
      }
      const newCategory = await jobRepository.createJobCategoryAsync(title);
      logger.info(`Job category created successfully with title ${title}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job category created!', newCategory, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating job category: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findCategories: async (): Promise<ServiceResponse<JobCategory[] | null>> => {
    try {
      logger.info('Finding categories...');
      const categories = await jobRepository.findCategoriesAsync();
      logger.info(`Categories found: ${JSON.stringify(categories)}`);
      return new ServiceResponse(
        ResponseStatus.Success,
        'Job categories fetched successfully',
        categories,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching job categories: Database Exception: ${(ex as Error).message}`;
      logger.error(errorMessage);
      logger.info('Category finding process failed');
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findJobCategory: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Finding job category with id ${id}`);
      const category = await jobRepository.findCategoryByIdAsync(id);
      if (!category) {
        logger.info(`Job category not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job category not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job category found: ${JSON.stringify(category)}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job category fetched successfully', category, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching job category with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateJobCategory: async (id: number, title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Updating job category with id ${id} and title ${title}`);
      const category = await jobRepository.findCategoryByIdAsync(id);
      if (!category) {
        logger.info(`Job category not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job category not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job category found with id ${id}`);
      const updatedJobCategory = await jobRepository.updateJobCatergoryAsync(id, title);
      logger.info(`Job category updated with id ${id} and title ${title}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job category updated', updatedJobCategory, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating job category with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteJobCategory: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Deleting job category with id ${id}`);
      const category = await jobRepository.findCategoryByIdAsync(id);
      if (!category) {
        logger.info(`Job category not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job category not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job category found with id ${id}`);
      const deletedCategory = await jobRepository.deleteJobCategoryAsync(id);
      logger.info(`Job category deleted with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job category deleted', deletedCategory, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting job category with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createJobLevel: async (title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Creating job level with title ${title}`);
      const existingLevel = await jobRepository.findLevelByTitleAsync(title);
      logger.info(`Existing level: ${JSON.stringify(existingLevel)}`);
      if (existingLevel) {
        logger.info(`Job Level already exists with title ${title}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Job level already exists', null, StatusCodes.CONFLICT);
      }

      const newLevel = await jobRepository.createJobLevelAsync(title);
      logger.info(`Job Level created successfully with title ${title}`);
      logger.info(`Created level: ${JSON.stringify(newLevel)}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job level created', newLevel, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating job level: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findJoblevels: async (): Promise<ServiceResponse<JobLevel[] | null>> => {
    try {
      logger.info(`Finding job levels`);
      const levels = await jobRepository.findLevelsAsync();
      logger.info(`Job levels found.`);
      if (levels?.length === 0) {
        logger.info(`Job levels not found`);
        return new ServiceResponse(ResponseStatus.Success, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job levels found`);
      return new ServiceResponse(ResponseStatus.Success, 'Job levels fetched successfully', levels, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching job levels: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findJoblevel: async (id: number): Promise<ServiceResponse<JobLevel | null>> => {
    try {
      logger.info(`Finding job level with id ${id}`);
      const level = await jobRepository.findLevelByIdAsync(id);
      logger.info(`Job level found: ${JSON.stringify(level)}`);
      if (!level) {
        logger.info(`Job level not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job level found with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job level fetched successfully', level, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching job level with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateJobLevel: async (id: number, title: string): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Updating job level with id ${id} and title ${title}`);
      const level = await jobRepository.findLevelByIdAsync(id);
      if (!level) {
        logger.info(`Job level not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job level found with id ${id}`);
      const updatedJobLevel = await jobRepository.updateJobLevelAsync(id, title);
      logger.info(`Job level updated with id ${id} and title ${title}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job level updated', updatedJobLevel, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating job level with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteJobLevel: async (id: number): Promise<ServiceResponse<JobCategory | null>> => {
    try {
      logger.info(`Deleting job level with id ${id}`);
      const level = await jobRepository.findLevelByIdAsync(id);
      if (!level) {
        logger.info(`Job level not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job level not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job level found with id ${id}`);
      const deletedLevel = await jobRepository.deleteJobLevelAsync(id);
      logger.info(`Job level deleted with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job level deleted', deletedLevel, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting job level with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findJobTotalViews: async (
    id: string
  ): Promise<ServiceResponse<{ job_id: string; totalViews: number | null } | null>> => {
    try {
      logger.info(`Finding total views for job with id ${id}`);
      const job = await jobRepository.findJobByIdAsync(id);
      logger.info(`Job found: ${JSON.stringify(job)}`);
      if (!job) {
        logger.info(`Job not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      const totalViews = await jobRepository.findJobTotalViewsAsync(id);
      const data = { job_id: id, totalViews };
      logger.info(`Total views found for job with id ${id}: ${data.totalViews}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job total views found', data, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding job total views: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  saveJob: async (jobId: string, userId: string): Promise<ServiceResponse<SavedJob | null>> => {
    try {
      logger.info(`Saving job with id ${jobId} for user ${userId}`);
      const findJob = await jobRepository.findJobByIdAsync(jobId);
      if (!findJob) {
        logger.info(`Job not found with id ${jobId}`);
        return new ServiceResponse(ResponseStatus.Success, 'Job not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Job with id ${jobId} found.`);
      const searchJob = await jobRepository.findSavedJobAsync(jobId, userId);
      if (searchJob) {
        logger.error(`Job already saved with id ${jobId} for user ${userId}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Job already saved', null, StatusCodes.CONFLICT);
      }
      const savedJob = await jobRepository.saveJobAsync(jobId, userId);
      logger.info(`Job saved with id ${jobId} for user ${userId}`);
      return new ServiceResponse(ResponseStatus.Success, 'Job saved', savedJob, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving job with id ${jobId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findSavedJobs: async (userId: string): Promise<ServiceResponse<Job[] | null>> => {
    try {
      //first we want to check if there are user but we dont have the user repo for now
      logger.info(`userId: ${userId}`);
      const result = await jobRepository.findSavedJobsAsync(userId);
      logger.info(`jobs: ${JSON.stringify(result)}`);
      if (!result) {
        logger.info(`No jobs saved!`);
        return new ServiceResponse(ResponseStatus.Success, 'No jobs saved!', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Jobs found`);
      return new ServiceResponse(ResponseStatus.Success, 'Saved jobs found', result, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding saved jobs: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
