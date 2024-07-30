import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '../../../common/models/serviceResponse';
import { app } from '../../../server';
import { Job } from '../../job/jobModel';

describe('Job API Endpoints', () => {
  describe('GET /jobs', () => {
    it('should return validation error for page index', async () => {
      // Act
      const response = await request(app).get('/jobs?pageIndex=-1');
      const responseBody: ServiceResponse<Job[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Page index must be a positive number');
    });
  });
});
