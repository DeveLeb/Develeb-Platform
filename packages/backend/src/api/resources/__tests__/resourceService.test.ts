import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Resource } from '../resourceModel';
import { resourceRepository } from '../resourceRepository';
import { resourceService } from '../resourceService';

vi.mock('@/api/resources/resourceRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
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
      (resourceRepository.findAllAsync as Mock).mockReturnValue(mockResources);

      // Act
      const result = await resourceService.findResources();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Resources found');
      expect(result.responseObject).toEqual(mockResources);
    });

    it('returns a not found error for no resources found', async () => {
      // Arrange
      (resourceRepository.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await resourceService.findResources();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No Resources found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAllAsync', async () => {
      // Arrange
      (resourceRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await resourceService.findResources();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Database error');
      expect(result.responseObject).toBeNull();
    });

  });

});
