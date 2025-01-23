import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from 'src/common/models/serviceResponse';
import { app } from 'src/server';
import request from 'supertest';

import { Tag } from '../tagsModel';

describe('Tags API Endpoints', () => {
  describe('GET /tags', () => {
    it('should return a list of tags', async () => {
      // Act
      const response = await request(app).get('/tags');
      const responseBody: ServiceResponse<Tag[]> = response.body;

      //Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Tags found');
    });
  });

  describe('GET /tags/:id', () => {
    it('should return a tag', async () => {
      // Act
      const response = await request(app).get('/tags/-1');
      const responseBody: ServiceResponse<Tag> = response.body;

      //Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
    });
  });
});
