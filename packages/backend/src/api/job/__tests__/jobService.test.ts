import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Job } from '../jobModel';
import { jobRepository } from '../jobRepository';
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
      title: 'Frontend Developer',
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
});
