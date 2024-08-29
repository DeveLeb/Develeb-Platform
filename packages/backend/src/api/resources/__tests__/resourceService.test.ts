import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Resource } from '../resourceModel';
import { resourceRepository } from '../resourceRepository';
import { resourceService } from '../resourceService';


vi.mock('../resourceRepository.ts');
vi.mock('../../../server', () => ({
  ...vi.importActual('../../../server'),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('resourceService', () => {
  const mockResources: Resource[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Introduction to TypeScript',
      description: 'A comprehensive guide to TypeScript programming language.',
      link: 'https://example.com/typescript-guide',
      publish: true,
      tags: 'typescript, programming, guide',
      type: 'article',
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Learn React',
      description: 'An in-depth tutorial on building applications with React.',
      link: 'https://example.com/learn-react',
      publish: true,
      tags: 'react, javascript, tutorial',
      type: 'video',
    },
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      title: 'Advanced Node.js',
      description: 'A course on advanced Node.js techniques and best practices.',
      link: 'https://example.com/advanced-nodejs',
      publish: false,
      tags: 'nodejs, backend, course',
      type: 'course',
    },
  ];
  describe('findResources', () => {
    it('return all resources', async () => {
      // Arrange
      (resourceRepository.findResourcesAsync as Mock).mockReturnValue({
        resources: mockResources,
        totalCount: mockResources.length,
      });

      // Act
      const filters = { pageIndex: 1, pageSize: 3 };
      const result = await resourceService.findResources(filters);
      const paginationInfo = {
        currentPage: filters.pageIndex,
        pageSize: filters.pageSize,
        totalCount: mockResources.length,
        totalPages: Math.ceil(mockResources.length / filters.pageSize),
      };
      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain(
        `Resources fetched successfully. Page ${filters.pageIndex} of ${paginationInfo.totalPages}. Total resources: ${paginationInfo.totalCount}`
      );
      expect(result.responseObject).toEqual({
        resources: mockResources,
        pagination: paginationInfo,
      });
    });

    it('returns a not found error for no resources found', async () => {
      // Arrange
      (resourceRepository.findResourcesAsync as Mock).mockReturnValue({
        resources: [],
        totalCount: 0,
      });

      // Act
      const filters = { pageIndex: 1, pageSize: 3, type: 'article', title: 'Introduction to TypeScript' };
      const result = await resourceService.findResources(filters);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No resources found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAllAsync', async () => {
      // Arrange
      (resourceRepository.findResourcesAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const filters = { pageIndex: 1, pageSize: 3, type: 'article', title: 'Introduction to TypeScript' };
      const result = await resourceService.findResources(filters);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('findResourceById', () => {
    it('returns a resource by id', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);

      // Act
      const result = await resourceService.findResourceById(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resource found');
      expect(result.responseObject).toEqual(resource);
    });

    it('returns a not found error for a non-existent resource', async () => {
      // Arrange
      const resourceId = 'non-existent-id';
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(null);

      // Act
      const result = await resourceService.findResourceById(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No resource found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findResourceAsync', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      (resourceRepository.findResourceAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await resourceService.findResourceById(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('createResource', () => {
    it('creates a new resource', async () => {
      // Arrange
      const newResource = {
        title: 'New Resource',
        description: 'A new resource',
        link: 'https://example.com/new-resource',
        publish: true,
        tags: 'new, resource',
        type: 'article',
      };
      const createdResource = { id: 'new-resource-id', ...newResource };
      (resourceRepository.createResourceAsync as Mock).mockReturnValue(createdResource);

      // Act
      const result = await resourceService.createResource(newResource);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resource created');
      expect(result.responseObject).toEqual(createdResource);
    });

    it('handles errors for createResourceAsync', async () => {
      // Arrange
      const newResource = {
        title: 'New Resource',
        description: 'A new resource',
        link: 'https://example.com/new-resource',
        publish: true,
        tags: 'new, resource',
        type: 'article',
      };
      (resourceRepository.createResourceAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await resourceService.createResource(newResource);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('updateResource', () => {
    it('updates an existing resource', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const updatedResource = {
        body: {
          title: 'Updated Resource',
          description: 'An updated resource',
          link: 'https://example.com/updated-resource',
          publish: true,
          tags: 'updated, resource',
          type: 'article',
        },
      };
      (resourceRepository.updateResourceAsync as Mock).mockReturnValue(updatedResource);
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);

      // Act
      const result = await resourceService.updateResource(resourceId, updatedResource);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resource updated');
      expect(result.responseObject).toEqual(updatedResource);
    });

    it('returns a not found error for a non-existent resource', async () => {
      // Arrange
      const resourceId = 'non-existent-id';
      const updatedResource = {
        body: {
          title: 'Updated Resource',
          description: 'An updated resource',
          link: 'https://example.com/updated-resource',
          publish: true,
          tags: 'updated, resource',
          type: 'article',
        },
      };
      (resourceRepository.updateResourceAsync as Mock).mockReturnValue(null);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(null);

      // Act
      const result = await resourceService.updateResource(resourceId, updatedResource);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No resource found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for updateResourceAsync', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const updatedResource = {
        body: {
          title: 'Updated Resource',
          description: 'An updated resource',
          link: 'https://example.com/updated-resource',
          publish: true,
          tags: 'updated, resource',
          type: 'article',
        },
      };
      (resourceRepository.updateResourceAsync as Mock).mockRejectedValue(new Error('Database error'));
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);

      // Act
      const result = await resourceService.updateResource(resourceId, updatedResource);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('deleteResource', () => {
    it('deletes an existing resource', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.deleteResourceAsync as Mock).mockReturnValue(resource);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);

      // Act
      const result = await resourceService.deleteResource(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resource deleted');
      expect(result.responseObject).toEqual(resource);
    });

    it('returns a not found error for a non-existent resource', async () => {
      // Arrange
      const resourceId = 'non-existent-id';
      (resourceRepository.deleteResourceAsync as Mock).mockReturnValue(false);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(null);

      // Act
      const result = await resourceService.deleteResource(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No resource found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for deleteResourceAsync', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      (resourceRepository.deleteResourceAsync as Mock).mockRejectedValue(new Error('Database error'));
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);

      // Act
      const result = await resourceService.deleteResource(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('findResourceViews', () => {
    it('returns the total views for a resource', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const totalViews = 100;
      (resourceRepository.findResourceTotalViewsAsync as Mock).mockReturnValue(totalViews);
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);
      
      // Act
      const result = await resourceService.findResourceViews(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resource views retrieved successfully');
      expect(result.responseObject).toEqual({ resource_id: resourceId, totalViews });
    });

    it('returns a not found error for a non-existent resource', async () => {
      // Arrange
      const resourceId = 'non-existent-id';
      (resourceRepository.findResourceTotalViewsAsync as Mock).mockReturnValue(null);

      // Act
      const result = await resourceService.findResourceViews(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No resource found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findResourceTotalViewsAsync', async () => {
      // Arrange
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      (resourceRepository.findResourceTotalViewsAsync as Mock).mockRejectedValue(new Error('Database error'));
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);
      // Act
      const result = await resourceService.findResourceViews(resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    }); 
  });
  describe('saveResourseForUser', () => {
    it('saves a resource for a user', async () => {
      // Arrange
      const userId = 'user-id';
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);
      (resourceRepository.saveResourceAsync as Mock).mockReturnValue(resource);
      // Act
      const result = await resourceService.saveResourceForUser(userId, resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resource saved');
      expect(result.responseObject).toEqual(resource);
    });

    it('returns a not found error for a non-existent resource', async () => {
      // Arrange
      const userId = 'user-id';
      const resourceId = 'non-existent-id';
      (resourceRepository.saveResourceAsync as Mock).mockReturnValue(false);

      // Act
      const result = await resourceService.saveResourceForUser(userId, resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No resource found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for saveResourceForUserAsync', async () => {
      // Arrange
      const userId = 'user-id';
      const resourceId = '550e8400-e29b-41d4-a716-446655440000';
      const resource = mockResources.find((r) => r.id === resourceId);
      (resourceRepository.findResourceAsync as Mock).mockReturnValue(resource);
      (resourceRepository.saveResourceAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await resourceService.saveResourceForUser(userId, resourceId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('findSavedResources', () => {
    it('returns saved resources for a user', async () => {
      // Arrange
      const userId = 'user-id';
      const savedResources = mockResources.slice(0, 2);
      (resourceRepository.findSavedResourcesAsync as Mock).mockReturnValue(savedResources);

      // Act
      const result = await resourceService.findSavedResources(userId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resources saved found');
      expect(result.responseObject).toEqual(savedResources);
    });

    it('returns a not found error for no saved resources', async () => {
      // Arrange
      const userId = 'user-id';
      (resourceRepository.findSavedResourcesAsync as Mock).mockReturnValue(null);

      // Act
      const result = await resourceService.findSavedResources(userId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No resources saved!');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findSavedResourcesAsync', async () => {
      // Arrange
      const userId = 'user-id';
      (resourceRepository.findSavedResourcesAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await resourceService.findSavedResources(userId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });
  });
});
