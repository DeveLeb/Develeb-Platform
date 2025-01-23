import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Tag } from '../tagsModel';
import { tagsRepository } from '../tagsRepository';
import { tagsService } from '../tagsService';

vi.mock('../tagsRepository');

vi.mock('../../../server', () => ({
  ...vi.importActual('../../../server'),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('tagsService', () => {
  const mockTags: Tag[] = [{ id: 1, name: 'tag1' }];

  describe('findAll', () => {
    it('should return all tags', async () => {
      //Arrange
      (tagsRepository.findAllTagsAsync as Mock).mockReturnValue({
        tags: mockTags,
      });

      //Act
      const result = await tagsService.findTags();

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tags found');
      expect(result.responseObject).toEqual({ tags: mockTags });
    });

    it('should return a server error', async () => {
      //Arrange
      vi.spyOn(tagsRepository, 'findAllTagsAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });

      //Act
      const result = await tagsService.findTags();

      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching tags: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('find a task by id', () => {
    it('should return a tag', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(mockTags[0]);

      //Act
      const result = await tagsService.findTagById(1);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag found');
      expect(result.responseObject).toEqual(mockTags[0]);
    });

    it('should return a not found error', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(null);
      //Act
      const result = await tagsService.findTagById(1);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag not found');
      expect(result.responseObject).toBeNull();
    });

    it('should return a server error', async () => {
      //Arrange
      vi.spyOn(tagsRepository, 'findTagByIdAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });
      //Act
      const result = await tagsService.findTagById(1);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error fetching tag with id 1: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('create a tag', () => {
    it('should create a tag', async () => {
      //Arrange
      (tagsRepository.createTagAsync as Mock).mockReturnValue(mockTags[0]);
      //Act
      const result = await tagsService.createTag('tag1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag created');
      expect(result.responseObject).toEqual(mockTags[0]);
    });

    it('should return a conflict error', async () => {
      //Arrange
      (tagsRepository.findTagByNameAsync as Mock).mockReturnValue(mockTags[0]);
      (tagsRepository.createTagAsync as Mock).mockReturnValue(null);
      //Act
      const result = await tagsService.createTag('tag1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Tag already exists');
      expect(result.responseObject).toBeNull();
    });

    it('should return a server error', async () => {
      //Arrange
      vi.spyOn(tagsRepository, 'createTagAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });
      //Act
      const result = await tagsService.createTag('tag1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error creating tag: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('delete a tag', () => {
    it('should delete a tag', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(mockTags[0]);
      (tagsRepository.deleteTagByIdAsync as Mock).mockReturnValue(mockTags[0]);
      //Act
      const result = await tagsService.deleteTag(1);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag deleted');
      expect(result.responseObject).toEqual(mockTags[0]);
    });

    it('should return a not found error', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(null);
      (tagsRepository.deleteTagByIdAsync as Mock).mockReturnValue(null);
      //Act
      const result = await tagsService.deleteTag(1);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag not found');
      expect(result.responseObject).toBeNull();
    });

    it('should return a server error', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(mockTags[0]);
      vi.spyOn(tagsRepository, 'deleteTagByIdAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });
      //Act
      const result = await tagsService.deleteTag(1);
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error deleting tag with id 1: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('update a tag', () => {
    it('should update a tag', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(mockTags[0]);
      (tagsRepository.updateTagAsync as Mock).mockReturnValue(mockTags[0]);
      //Act
      const result = await tagsService.updateTag(1, 'tag1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag updated');
      expect(result.responseObject).toEqual(mockTags[0]);
    });

    it('should return a not found error', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(null);
      (tagsRepository.updateTagAsync as Mock).mockReturnValue(null);
      //Act
      const result = await tagsService.updateTag(1, 'tag1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Tag not found');
      expect(result.responseObject).toBeNull();
    });

    it('should return a server error', async () => {
      //Arrange
      (tagsRepository.findTagByIdAsync as Mock).mockReturnValue(mockTags[0]);
      vi.spyOn(tagsRepository, 'updateTagAsync').mockImplementation(() => {
        throw new Error('Database Exception');
      });
      //Act
      const result = await tagsService.updateTag(1, 'tag1');
      //Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating tag with id 1: Database Exception');
      expect(result.responseObject).toBeNull();
    });
  });
});
