import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';
import { ZodError } from 'zod';

import { Resource } from './resourceModel';
import { resourceRepository } from './resourceRepository';
import { CreateResourceRequest, PutResourceRequest } from './resourceRequest';

type PaginationInfo = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const resourceService = {
  findResources: async (filters: {
    pageIndex: number;
    pageSize: number;
    type?: string;
    title?: string;
  }): Promise<ServiceResponse<{ resources: Resource[]; pagination: PaginationInfo } | null>> => {
    try {
      const { pageIndex, pageSize, type, title } = filters;
      if (pageIndex < 1 || pageSize < 1) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Invalid pagination parameters',
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const offset = (pageIndex - 1) * pageSize;

      logger.info(`Fetching resources with filters: ${JSON.stringify(filters)}`);

      const { resources, totalCount } = await resourceRepository.findResourcesAsync({
        limit: pageSize,
        offset,
        type,
        title,
      });

      logger.debug(`Repository returned ${resources.length} resources out of ${totalCount} total`);

      if (resources.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resources found', null, StatusCodes.NOT_FOUND);
      }

      const paginationInfo: PaginationInfo = {
        currentPage: pageIndex,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      };

      const successMessage = `Resources fetched successfully. Page ${pageIndex} of ${paginationInfo.totalPages}. Total resources: ${totalCount}`;
      const responseData = {
        resources: resources,
        pagination: paginationInfo,
      };

      logger.info(successMessage);

      return new ServiceResponse(ResponseStatus.Success, successMessage, responseData, StatusCodes.OK);
    } catch (ex) {
      if (ex instanceof ZodError) {
        const errorMessage = `Validation error in resource data: ${ex.errors.map((e) => e.message).join(', ')}`;
        logger.error(errorMessage);
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.BAD_REQUEST);
      }

      const errorMessage = `Error finding resources: ${(ex as Error).message}`;
      logger.error(errorMessage, { error: ex });
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  createResource: async (createResource: CreateResourceRequest): Promise<ServiceResponse<Resource | null>> => {
    try {
      const createdResource = await resourceRepository.createResourceAsync(createResource);
      return new ServiceResponse(ResponseStatus.Success, 'Resource created', createdResource, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating resource: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findResourceById: async (id: string): Promise<ServiceResponse<Resource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse(ResponseStatus.Success, 'Resource found', resource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding resource with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateResource: async (
    id: string,
    updateResourceRequest: PutResourceRequest
  ): Promise<ServiceResponse<Resource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const updatedResource = await resourceRepository.updateResourceAsync(id, updateResourceRequest);
      return new ServiceResponse(ResponseStatus.Failed, 'No resource found', updatedResource, StatusCodes.NOT_FOUND);
    } catch (ex) {
      const errorMessage = `Error updating resource with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  deleteResource: async (id: string): Promise<ServiceResponse<Resource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const deletedResource = await resourceRepository.deleteResourceAsync(id);
      return new ServiceResponse(ResponseStatus.Failed, 'Resource deleted', deletedResource, StatusCodes.NOT_FOUND);
    } catch (ex) {
      const errorMessage = `Error deleting resource with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findResourceViews: async (
    id: string
  ): Promise<ServiceResponse<{ resource_id: string; totalViews: number | null } | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const totalViews = await resourceRepository.findResourceTotalViewsAsync(id);
      const resourceTotalViews = { resource_id: id, totalViews };
      return new ServiceResponse(
        ResponseStatus.Success,
        'Resource views retrieved successfully',
        resourceTotalViews,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding resource with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  saveResourceForUser: async (resourceId: string, userId: string): Promise<ServiceResponse<Resource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(resourceId);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const savedResource = await resourceRepository.saveResourceAsync(resourceId, userId);
      return new ServiceResponse(ResponseStatus.Success, 'Resource saved successfully', savedResource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving resource with id ${resourceId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findSavedResources: async (userId: string): Promise<ServiceResponse<Resource[] | null>> => {
    try {
      //check userID
      logger.info(`userId: ${userId}`);
      const result = await resourceRepository.findSavedResourcesAsync(userId);
      logger.info(`resources: ${JSON.stringify(result)}`);
      if (!result) {
        logger.info(`No resources saved!`);
        return new ServiceResponse(ResponseStatus.Success, 'No resources saved!', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Resources found`);
      return new ServiceResponse(ResponseStatus.Success, 'Resources saved found', result, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding saved resources for user with id ${userId}: ${ex as Error}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
