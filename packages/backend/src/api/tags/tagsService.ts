import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';

import { Tag } from './tagsModel';
import { tagsRepository } from './tagsRepository';

export const tagsService = {
  findTags: async (): Promise<ServiceResponse<Tag[] | null>> => {
    try {
      logger.info('findTags called');
      const tags = await tagsRepository.findAllTagsAsync();
      logger.info('tags from db:', tags);
      if (tags?.length === 0) {
        logger.info('tags not found');
        return new ServiceResponse(ResponseStatus.Success, 'Tags not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('tags found');
      return new ServiceResponse(ResponseStatus.Success, 'Tags found', tags, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching tags: ${(ex as Error).message}`;

      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findTagById: async (id: number): Promise<ServiceResponse<Tag | null>> => {
    try {
      logger.info('findTagById called with id:', id);
      if (!id) {
        logger.info('Invalid id');
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      }
      const tag = await tagsRepository.findTagByIdAsync(id);
      logger.info('tag from db:', tag);
      if (!tag) {
        logger.info('tag not found');
        return new ServiceResponse(ResponseStatus.Success, 'Tag not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('tag found');
      return new ServiceResponse(ResponseStatus.Success, 'Tag found', tag, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching tag with id ${id}: ${(ex as Error).message}`;

      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createTag: async (name: string): Promise<ServiceResponse<Tag | null>> => {
    try {
      logger.info('createTag called with name:', name);
      if (!name) {
        logger.info('Invalid input');
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      }
      const createdTag = await tagsRepository.createTagAsync(name);
      logger.info('tag from db:', createdTag);
      if (!createdTag) {
        logger.info('tag creation failed');
        return new ServiceResponse(ResponseStatus.Failed, 'Tag creation failed', null, StatusCodes.BAD_REQUEST);
      }
      logger.info('tag created');
      return new ServiceResponse(ResponseStatus.Success, 'Tag created', createdTag, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating tag: ${(ex as Error).message}`;

      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateTag: async (id: number, name: string): Promise<ServiceResponse<Tag | null>> => {
    logger.info('updateTag called with id:', id, 'and name:', name);
    try {
      if (!id || !name) {
        logger.info('Invalid input');
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      }
      const updatedTag = await tagsRepository.updateTagAsync(id, name);
      logger.info('tag from db:', updatedTag);
      if (!updatedTag) {
        logger.info('tag update failed');
        return new ServiceResponse(ResponseStatus.Failed, 'Tag update failed', null, StatusCodes.BAD_REQUEST);
      }
      logger.info('tag updated');
      return new ServiceResponse(ResponseStatus.Success, 'Tag updated', updatedTag, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating tag with id ${id}: ${(ex as Error).message}`;

      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteTag: async (id: number): Promise<ServiceResponse<Tag | null>> => {
    try {
      logger.info('deleteTag called with id:', id);
      if (!id) {
        logger.info('Invalid input');
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      }
      const deletedTag = await tagsRepository.deleteTagByIdAsync(id);
      logger.info('tag from db:', deletedTag);
      if (!deletedTag) {
        logger.info('tag deletion failed');
        return new ServiceResponse(ResponseStatus.Failed, 'Tag deletion failed', null, StatusCodes.BAD_REQUEST);
      }
      logger.info('tag deleted');
      return new ServiceResponse(ResponseStatus.Success, 'Tag deleted', deletedTag, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting tag with id ${id}: ${(ex as Error).message}`;

      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
