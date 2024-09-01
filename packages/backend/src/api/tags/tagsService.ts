import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';

import { Tag } from './tagsModel';
import { tagsRepository } from './tagsRepository';

export const tagsService = {
  findTags: async (): Promise<ServiceResponse<Tag[] | null>> => {
    try {
      const tags = await tagsRepository.findAllTagsAsync();
      if (tags?.length === 0)
        return new ServiceResponse(ResponseStatus.Success, 'Tags not found', null, StatusCodes.NOT_FOUND);
      return new ServiceResponse(ResponseStatus.Success, 'Tags found', tags, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching tags: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findTagById: async (id: number): Promise<ServiceResponse<Tag | null>> => {
    try {
      if (!id) return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      const tag = await tagsRepository.findTagByIdAsync(id);
      if (!tag) return new ServiceResponse(ResponseStatus.Success, 'Tag not found', null, StatusCodes.NOT_FOUND);
      return new ServiceResponse(ResponseStatus.Success, 'Tag found', tag, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error fetching tag with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createTag: async (name: string): Promise<ServiceResponse<Tag | null>> => {
    try {
      if (!name) return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      const createdTag = await tagsRepository.createTagAsync(name);
      if (!createdTag)
        return new ServiceResponse(ResponseStatus.Failed, 'Tag creation failed', null, StatusCodes.BAD_REQUEST);
      return new ServiceResponse(ResponseStatus.Success, 'Tag created', createdTag, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating tag: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateTag: async (id: number, name: string): Promise<ServiceResponse<Tag | null>> => {
    try {
      if (!id || !name)
        return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      const updatedTag = await tagsRepository.updateTagAsync(id, name);
      if (!updatedTag)
        return new ServiceResponse(ResponseStatus.Failed, 'Tag update failed', null, StatusCodes.BAD_REQUEST);
      return new ServiceResponse(ResponseStatus.Success, 'Tag updated', updatedTag, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating tag with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteTag: async (id: number): Promise<ServiceResponse<Tag | null>> => {
    try {
      if (!id) return new ServiceResponse(ResponseStatus.Failed, 'Invalid input', null, StatusCodes.BAD_REQUEST);
      const deletedTag = await tagsRepository.deleteTagByIdAsync(id);
      if (!deletedTag)
        return new ServiceResponse(ResponseStatus.Failed, 'Tag deletion failed', null, StatusCodes.BAD_REQUEST);
      return new ServiceResponse(ResponseStatus.Success, 'Tag deleted', deletedTag, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting tag with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
