import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from 'src/common/models/serviceResponse';
import request from 'supertest';

import { app } from '../../../server';
import { Resource } from '../resourceModel';

describe('Resources API Endpoints', () => {
  describe('GET /resources', () => {
    it('should return validation error for page index', async () => {
      const response = await request(app).get('/resources?pageIndex=-1');
      const responseBody: ServiceResponse<Resource[]> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Page index must be a positive number');
    });
  });
  describe('GET /resources/:id', () => {
    it('should return validation error for resource id', async () => {
      const response = await request(app).get('/resources/invalid-id');
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Resource ID is not a valid UUID');
    });
  });
  describe('POST /resources', () => {
    it('should return validation error for resource title', async () => {
      const response = await request(app).post('/resources').send({ title: '', link: '' });
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Title is required');
    });
    it('should return validation error for resource link', async () => {
      const response = await request(app).post('/resources').send({ title: 'New Resource', link: '' });
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Link is required');
    });
  });
  describe('PUT /resources/:id', () => {
    it('should return validation error for resource id', async () => {
      const response = await request(app)
        .put('/resources/invalid-id')
        .send({ title: 'Updated Resource', link: 'http://example.com' });
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Resource ID is not a valid UUID');
    });
    it('should return validation error for resource title', async () => {
      const response = await request(app)
        .put('/resources/7e29bf86-2e5e-4fbd-9374-1e2b35d26477')
        .send({ title: '', link: 'http://example.com' });
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Title is required');
    });
  });
  describe('DELETE /resources/:id', () => {
    it('should return validation error for resource id', async () => {
      const response = await request(app).delete('/resources/invalid-id');
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Resource ID is not a valid UUID');
    });
  });
  describe('POST /resources/:resourceId/save/:userId', () => {
    it('should return validation error for resource id', async () => {
      const response = await request(app).post('/resources/123/save/123');
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Resource ID is not a valid UUID');
    });
    it('should return validation error for user id', async () => {
      const response = await request(app).post('/resources/7e29bf86-2e5e-4fbd-9374-1e2b35d26477/save/invalid-id');
      const responseBody: ServiceResponse<Resource> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: User ID is not a valid UUID');
    });
  });
  describe('GET /resources/:userId/saved/resources', () => {
    it('should return validation error for user id', async () => {
      const response = await request(app).get('/resources/invalid-id/saved/resources');
      const responseBody: ServiceResponse<Resource[]> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: User ID is not a valid UUID');
    });
  });
  describe('GET /resources/:id/views', () => {
    it('should return validation error for resource id', async () => {
      const response = await request(app).get('/resources/invalid-id/views');
      const responseBody: ServiceResponse<number> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input: Resource ID is not a valid UUID');
    });
});
});