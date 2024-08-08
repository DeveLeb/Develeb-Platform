import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Job } from '../jobModel';
import { jobRepository } from '../jobRepository';
import { JobCategory, JobLevel } from '../jobResponse';
import { jobService } from '../jobService';

vi.mock('../jobRepository');
vi.mock('../../../server', () => ({
  ...vi.importActual('../../../server'),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('jobService', () => {
  const mockJobs: Job[] = [
    {
      id: 'uuid1',
      title: 'Backend Developer',
      levelId: 1,
      categoryId: 1,
      typeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      location: '',
      description: '',
      applicationLink: null,
      companyId: null,
      postedAt: null,
      tags: '',
      isApproved: false,
    },
  ];
  const mockJobRequest = {
    body: {
      title: 'new title',
      levelId: 2,
      categoryId: 2,
      typeId: 2,
      location: 'new location',
      description: 'new description',
      compensation: 'new compensation',
      applicationLink: 'new applicationLink',
      isExternal: true,
      companyId: 'new companyId',
      tags: 'new tags',
    },
  };

  const mockJobCategories: JobCategory[] = [
    {
      id: 3,
      title: 'Data science',
    },
  ];

  const mockJobLevels: JobLevel[] = [
    {
      id: 2,
      title: 'Mid',
    },
  ];
  describe('findAll', () => {
    it('return all jobs', async () => {
      // Arrange
      (jobRepository.findJobsAsync as Mock).mockReturnValue({
        jobs: mockJobs,
        totalCount: mockJobs.length,
      });

      // Act
      const result = await jobService.findJobs({
        pageIndex: 0,
        pageSize: 1,
      });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Jobs fetched successfully. Page 0 of 1. Total jobs: 1.');
      expect(result.responseObject).toEqual(mockJobs);
    });

    it('returns a server error', async () => {
      // Arrange
      vi.spyOn(jobRepository, 'findJobsAsync').mockImplementation(() => {
        throw new Error('Database exception');
      });
      // Act
      const result = await jobService.findJobs({
        pageIndex: 0,
        pageSize: 1,
      });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching jobs: Error: Database exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find job by id', () => {
    it('return a job', async () => {
      // Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);

      //Act
      const result = await jobService.findJobById('');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job found');
      expect(result.responseObject).toEqual(mockJobs[0]);
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(null);
      const result = await jobService.findJobById('uuid123');
      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('returns a server error', async () => {
      // Arrange
      vi.spyOn(jobRepository, 'findJobByIdAsync').mockImplementation(() => {
        throw new Error('Database exception');
      });
      // Act
      const result = await jobService.findJobById('uuid');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding job with id uuid:, Database exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('delete job', () => {
    it('returns not found', async () => {
      // Arrange
      (jobRepository.findJobByIdAsync as Mock).mockResolvedValue(null);

      // Act
      const result = await jobService.deleteJobById('uuid1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('successfully deletes an existing job', async () => {
      // Arrange
      const mockJob = mockJobs[0];
      (jobRepository.findJobByIdAsync as Mock).mockResolvedValue(mockJob);
      (jobRepository.deleteJobByIdAsync as Mock).mockResolvedValue(mockJob);

      // Act
      const result = await jobService.deleteJobById('uuid1');

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job deleted');
      expect(result.responseObject).toEqual(mockJob);
    });

    it('return a server error', async () => {
      // Arrange
      vi.spyOn(jobRepository, 'findJobByIdAsync').mockImplementation(() => {
        throw new Error('Connection problem');
      });
      // Act
      const result = await jobService.deleteJobById('uuid1');
      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error deleting job with id uuid1:, Connection problem');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('update job', async () => {
    it('returns not found', async () => {
      // Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.updateJob('uuid1', mockJobRequest);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('successfully updates an existing job', async () => {
      // Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      (jobRepository.updateJobAsync as Mock).mockReturnValue(mockJobRequest);

      // Act
      const result = await jobService.updateJob('uuid1', mockJobRequest);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job updated');
      expect(result.responseObject).toEqual(mockJobRequest);
    });

    it('returns a server error', async () => {
      // Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      vi.spyOn(jobRepository, 'updateJobAsync').mockImplementation(() => {
        throw new Error('Database exception');
      });
      // Act
      const result = await jobService.updateJob('uuid1', mockJobRequest);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating job with id uuid1:, Database exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('creating job', async () => {
    it('return created job', async () => {
      //Arrange
      (jobRepository.createJobAsync as Mock).mockReturnValue(mockJobRequest);

      //Act
      const result = await jobService.submitJobForApproval(mockJobRequest.body, false);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job created');
      expect(result.responseObject).toEqual(mockJobRequest);
    });

    it('return fail creation', async () => {
      //Assert
      (jobRepository.createJobAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.submitJobForApproval(mockJobRequest.body, false);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Job creation failed');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      vi.spyOn(jobRepository, 'createJobAsync').mockImplementation(() => {
        throw new Error('Database exception');
      });
      //Act
      const result = await jobService.submitJobForApproval(mockJobRequest.body, false);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error creating job: Database exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('aaprve a job', async () => {
    const approvedJob = {
      ...mockJobs[0],
      isApproved: true,
    };
    it('return approved job', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      (jobRepository.approveJobAsync as Mock).mockReturnValue(approvedJob);

      //Act
      const result = await jobService.approveJob('uuid1');

      //Arrange
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job approved');
      expect(result.responseObject).toEqual(approvedJob);
    });

    it('return no job found', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.approveJob('uuid1');

      //Arrange
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('return job alread approved', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(approvedJob);

      //Act
      const result = await jobService.approveJob('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Job already approved');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      vi.spyOn(jobRepository, 'approveJobAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.approveJob('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error approving job with id uuid1:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('reject a job', async () => {
    it('return the rejected job', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      (jobRepository.deleteJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);

      //Act
      const result = await jobService.rejectJob('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job rejected');
      expect(result.responseObject).toEqual(mockJobs[0]);
    });

    it('return no job found', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.rejectJob('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      vi.spyOn(jobRepository, 'deleteJobByIdAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });
      //Act
      const result = await jobService.rejectJob('uuid1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error rejecting job with id uuid1:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('create a job category', async () => {
    it('return created job category', async () => {
      //Arrange
      (jobRepository.findCategorybyTitleAsync as Mock).mockReturnValue(null);
      (jobRepository.createJobCategoryAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.createJobCategory('Data science');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category created');
      expect(result.responseObject).toEqual(mockJobCategories[0]);
    });

    it('return a conflict', async () => {
      //Arrange
      (jobRepository.findCategorybyTitleAsync as Mock).mockReturnValue(mockJobCategories[0]);
      (jobRepository.createJobCategoryAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.createJobCategory('Data science');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Job category already exists');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findCategorybyTitleAsync as Mock).mockReturnValue(null);
      vi.spyOn(jobRepository, 'createJobCategoryAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.createJobCategory('AI');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error creating job category: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find categories', async () => {
    it('return all categories', async () => {
      //Arrange
      (jobRepository.findCategoriesAsync as Mock).mockReturnValue(mockJobCategories);

      //Act
      const result = await jobService.findCategories();

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job categories fetched successfully');
      expect(result.responseObject).toEqual(mockJobCategories);
    });

    it('return a server error', async () => {
      //Arrange
      vi.spyOn(jobRepository, 'findCategoriesAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.findCategories();

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching job categories: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find a category', async () => {
    it('return a job category', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.findJobCategory(3);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category fetched successfully');
      expect(result.responseObject).toEqual(mockJobCategories[0]);
    });

    it('return a not found error', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.findJobCategory(3);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      vi.spyOn(jobRepository, 'findCategoryByIdAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.findJobCategory(3);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching job category with id 3:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('update job category', async () => {
    it('return the updated job category', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(mockJobCategories[0]);
      (jobRepository.updateJobCatergoryAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.updateJobCategory(3, 'Backend');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category updated');
      expect(result.responseObject).toEqual(mockJobCategories[0]);
    });

    it('return a not found ', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(null);
      (jobRepository.updateJobCatergoryAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.updateJobCategory(3, 'Backend');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(mockJobCategories[0]);
      vi.spyOn(jobRepository, 'updateJobCatergoryAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.updateJobCategory(3, 'Backend');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating job category with id 3:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('delete job category', async () => {
    it('return success delete', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(mockJobCategories[0]);
      (jobRepository.deleteJobCategoryAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.deleteJobCategory(3);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category deleted');
      expect(result.responseObject).toEqual(mockJobCategories[0]);
    });

    it('return not found', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(null);
      (jobRepository.deleteJobCategoryAsync as Mock).mockReturnValue(mockJobCategories[0]);

      //Act
      const result = await jobService.deleteJobCategory(3);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job category not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findCategoryByIdAsync as Mock).mockReturnValue(mockJobCategories[0]);
      vi.spyOn(jobRepository, 'deleteJobCategoryAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.deleteJobCategory(3);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error deleting job category with id 3:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('create job level', async () => {
    it('return created job', async () => {
      //Arrange
      (jobRepository.findLevelByTitleAsync as Mock).mockReturnValue(null);
      (jobRepository.createJobLevelAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.createJobLevel('Junior');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level created');
      expect(result.responseObject).toEqual(mockJobLevels[0]);
    });

    it('return conflict', async () => {
      //Arrange
      (jobRepository.findLevelByTitleAsync as Mock).mockReturnValue(mockJobLevels[0]);
      (jobRepository.createJobLevelAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.createJobLevel('Junior');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Job level already exists');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(mockJobLevels[0]);
      vi.spyOn(jobRepository, 'createJobLevelAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.createJobLevel('Junior');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error creating job level: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find job levels', async () => {
    it('return all levels', async () => {
      //Arrange
      (jobRepository.findLevelsAsync as Mock).mockReturnValue(mockJobLevels);

      //Act
      const result = await jobService.findJoblevels();

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job levels fetched successfully');
      expect(result.responseObject).toEqual(mockJobLevels);
    });

    it('return a server error', async () => {
      //Arrange
      vi.spyOn(jobRepository, 'findLevelsAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.findJoblevels();

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching job levels: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find a level', async () => {
    it('return a job level', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.findJoblevel(2);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level fetched successfully');
      expect(result.responseObject).toEqual(mockJobLevels[0]);
    });

    it('return a not found', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.findJoblevel(1);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      vi.spyOn(jobRepository, 'findLevelByIdAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.findJoblevel(1);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching job level with id 1: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('update job level', async () => {
    it('return updated level', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(mockJobLevels[0]);
      (jobRepository.updateJobLevelAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.updateJobLevel(2, 'Senior');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level updated');
      expect(result.responseObject).toEqual(mockJobLevels[0]);
    });

    it('return a not found', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(null);
      (jobRepository.updateJobLevelAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.updateJobLevel(2, 'Senior');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(mockJobLevels[0]);
      vi.spyOn(jobRepository, 'updateJobLevelAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.updateJobLevel(2, 'Senior');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating job level with id 2:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('delete a job level', async () => {
    it('return deleted job', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(mockJobLevels[0]);
      (jobRepository.deleteJobLevelAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.deleteJobLevel(2);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level deleted');
      expect(result.responseObject).toEqual(mockJobLevels[0]);
    });

    it('return not found', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(null);
      (jobRepository.deleteJobLevelAsync as Mock).mockReturnValue(mockJobLevels[0]);

      //Act
      const result = await jobService.deleteJobLevel(2);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job level not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findLevelByIdAsync as Mock).mockReturnValue(mockJobLevels[0]);
      vi.spyOn(jobRepository, 'deleteJobLevelAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.deleteJobLevel(2);

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error deleting job level with id 2:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find job total views', async () => {
    it('return total views for a job', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      (jobRepository.findJobTotalViewsAsync as Mock).mockReturnValue(13);

      //Act
      const result = await jobService.findJobTotalViews('uuid1');
      const data = {
        job_id: 'uuid1',
        totalViews: 13,
      };

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job total views found');
      expect(result.responseObject).toEqual(data);
    });

    it('return job not found', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(null);
      (jobRepository.findJobTotalViewsAsync as Mock).mockReturnValue(13);

      //Act
      const result = await jobService.findJobTotalViews('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      vi.spyOn(jobRepository, 'findJobTotalViewsAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.findJobTotalViews('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding job total views: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('save a job', async () => {
    it('return saved job', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      (jobRepository.findSavedJobAsync as Mock).mockReturnValue(null);
      (jobRepository.saveJobAsync as Mock).mockReturnValue(mockJobs[0]);

      //Act
      const result = await jobService.saveJob('uuid1', 'uuid12');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job saved');
      expect(result.responseObject).toEqual(mockJobs[0]);
    });

    it('return a conflict', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      (jobRepository.findSavedJobAsync as Mock).mockReturnValue(mockJobs[0]);

      //Act
      const result = await jobService.saveJob('uuid1', 'uuid12');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Job already saved');
      expect(result.responseObject).toBeNull();
    });

    it('return job not found', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(null);
      (jobRepository.findSavedJobAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.saveJob('uuid1', 'uuid12');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Job not found');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      (jobRepository.findJobByIdAsync as Mock).mockReturnValue(mockJobs[0]);
      vi.spyOn(jobRepository, 'saveJobAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.saveJob('uuid1', 'uuid12');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error saving job with id uuid1:, Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find saved jobs', async () => {
    it('return all saved jobs', async () => {
      //Arrange
      (jobRepository.findSavedJobsAsync as Mock).mockReturnValue(mockJobs);

      //Act
      const result = await jobService.findSavedJobs('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Saved jobs found');
      expect(result.responseObject).toEqual(mockJobs);
    });

    it('return a not found', async () => {
      //Arrange
      (jobRepository.findSavedJobsAsync as Mock).mockReturnValue(null);

      //Act
      const result = await jobService.findSavedJobs('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No jobs saved!');
      expect(result.responseObject).toBeNull();
    });

    it('return a server error', async () => {
      //Arrange
      vi.spyOn(jobRepository, 'findSavedJobsAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await jobService.findSavedJobs('uuid1');

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding saved jobs: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });
});
