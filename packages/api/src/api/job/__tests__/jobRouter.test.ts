import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '../../../common/models/serviceResponse';
import { app } from '../../../server';
import { Job } from '../../job/jobModel';
import { JobCategory, JobLevel } from '../jobResponse';
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

  describe('POST /jobs', async () => {
    it('return bad request error for level id', async () => {
      // Arrange
      const invalidData = {
        title: 'remote backend developer',
        levelId: 20,
        categoryId: 1,
        typeId: 1,
        location: 'somewhere',
        description: 'full time backend developer',
        compensation: '30000-35000 per year',
        applicationLink: 'https://www.google.com',
        isExternal: true,
        companyId: '5e9b7a2c-3f8d-4e1a-b6c9-2d7f0a1e4b3c',
        tags: 'tag1, tag2',
      };
      // Act
      const response = await request(app).post('/jobs').send(invalidData);
      const responseBody: ServiceResponse<Job> = response.body;
      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });

  describe('POST /:jobId/save/:userId', async () => {
    it('return a validation error for job id', async () => {
      // Act
      const response = await request(app).post('/jobs/12341/save/5e9b7a2c-3f8d-4e1a-b6c9-2d7f0a1e4b3c');
      const responseBody: ServiceResponse<Job[]> = response.body;
      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid jobId input');
    });
  });

  describe('GET /category/:id', async () => {
    it('return a validation error on category id', async () => {
      //Act
      const response = await request(app).get('/jobs/category/-12');
      const responseBody: ServiceResponse<JobCategory> = response.body;

      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: ID must be a positive number');
    });
  });

  describe('PUT /category/:id', async () => {
    it('return a validation error on id', async () => {
      //Arrange
      const data = { title: '123123' };

      //Act
      const response = await request(app).put('/jobs/category/w').send(data);
      const responseBody: ServiceResponse<JobCategory> = response.body;

      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });

  describe('GET /jobs/level/:id', async () => {
    it('return a validation error for level id', async () => {
      //Act
      const response = await request(app).get('/jobs/level/-1');
      const responseBody: ServiceResponse<JobLevel> = response.body;

      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });

  describe('PUT /jobs/level/:id', async () => {
    it('return a validation error', async () => {
      //Arrange
      const data = { title: '' };
      //Act
      const response = await request(app).put('/jobs/level/1').send(data);
      const responseBody: ServiceResponse<JobLevel> = response.body;
      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });

  describe('DELETE /jobs/level/:id', async () => {
    it('return a validation error for the requested id', async () => {
      //Act
      const response = await request(app).delete('/jobs/level/-1');

      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.success).toBeFalsy();
      expect(response.body.message).toContain('Invalid input');
    });
  });

  describe('GET /jobs/:id', async () => {
    it('return a validation error for the id', async () => {
      //Act
      const response = await request(app).get('/jobs/1234');
      const responseBody: ServiceResponse<Job> = response.body;
      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });
  describe('DELETE /jobs/:id', async () => {
    it('return a validation error for the id', async () => {
      //Act
      const response = await request(app).delete('/jobs/1234');
      const responseBody: ServiceResponse<Job> = response.body;
      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });

  describe('PUT /jobs/:id', async () => {
    it('return bad request error for level id', async () => {
      // Arrange
      const invalidData = {
        title: '',
        levelId: 2,
        categoryId: 1,
        typeId: 1,
        location: 'somewhere',
        description: 'full time backend developer',
        compensation: '30000-35000 per year',
        applicationLink: 'https://www.google.com',
        isExternal: true,
        companyId: '5e9b7a2c-3f8d-4e1a-b6c9-2d7f0a1e4b3c',
        tags: 'tag1, tag2',
      };
      // Act
      const response = await request(app).put('/jobs/05510418-ad60-4b1b-ace2-32e04dbe9c12').send(invalidData);
      const responseBody: ServiceResponse<Job> = response.body;
      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });

  describe('POST /jobs/:id/reject', async () => {
    it('return a validation error', async () => {
      //Act
      const response = await request(app).post('/jobs/1234/reject');
      const responseBody: ServiceResponse<Job> = response.body;
      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });
});
