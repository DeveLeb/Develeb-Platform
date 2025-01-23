import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';
import { ZodError } from 'zod';

import { Resource, SavedResource } from './resourceModel';
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
      logger.info('Received filters:', JSON.stringify(filters));
      const { pageIndex, pageSize, type, title } = filters;

      const offset = (pageIndex - 1) * pageSize;

      logger.info(`Fetching resources with filters: ${JSON.stringify(filters)}`);

      const { resources, totalCount } = await resourceRepository.findResourcesAsync({
        limit: pageSize,
        offset,
        type,
        title,
      });

      logger.info(`Repository returned ${resources.length} resources out of ${totalCount} total`);

      if (resources.length === 0) {
        logger.info('No resources found');
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
      logger.error(errorMessage, ex);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  createResource: async (createResource: CreateResourceRequest): Promise<ServiceResponse<Resource | null>> => {
    try {
      logger.info('Attempting to create resource:', JSON.stringify(createResource));
      const createdResource = await resourceRepository.createResourceAsync(createResource);
      logger.info('Resource created successfully:', JSON.stringify(createdResource));
      return new ServiceResponse(ResponseStatus.Success, 'Resource created', createdResource, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating resource: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findResourceById: async (id: string): Promise<ServiceResponse<Resource | null>> => {
    try {
      logger.info(`Attempting to find resource with id ${id}`);
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        logger.info(`No resource found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Resource found with id ${id}:`, JSON.stringify(resource));
      return new ServiceResponse(ResponseStatus.Success, 'Resource found', resource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding resource with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateResource: async (
    id: string,
    updateResourceRequest: PutResourceRequest['body']
  ): Promise<ServiceResponse<Resource | null>> => {
    try {
      logger.info(`Attempting to update resource with id ${id}`);
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        logger.info(`No resource found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Updating resource with id ${id} with data:`, JSON.stringify(updateResourceRequest));
      const updatedResource = await resourceRepository.updateResourceAsync(id, updateResourceRequest);
      logger.info(`Resource updated successfully with id ${id}`);
      return new ServiceResponse(ResponseStatus.Success, 'Resource updated', updatedResource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating resource with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage, ex);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  deleteResource: async (id: string): Promise<ServiceResponse<Resource | null>> => {
    try {
      logger.info(`Attempting to delete resource with id ${id}`);
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        logger.info(`No resource found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Resource found with id ${id}. About to delete...`);
      const deletedResource = await resourceRepository.deleteResourceAsync(id);
      logger.info(`Resource deleted with id ${id}:`, JSON.stringify(deletedResource));
      return new ServiceResponse(ResponseStatus.Success, 'Resource deleted', deletedResource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting resource with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage, ex);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findResourceViews: async (
    id: string
  ): Promise<ServiceResponse<{ resource_id: string; totalViews: number | null } | null>> => {
    try {
      logger.info(`Attempting to find resource views for resource with id ${id}`);
      const resource = await resourceRepository.findResourceAsync(id);
      logger.info(`Resource found with id ${id}:`, JSON.stringify(resource));
      if (!resource) {
        logger.info(`No resource found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const totalViews = await resourceRepository.findResourceTotalViewsAsync(id);
      const resourceTotalViews = { resource_id: id, totalViews };
      logger.info(`Resource views found for resource with id ${id}:`, JSON.stringify(resourceTotalViews));
      return new ServiceResponse(
        ResponseStatus.Success,
        'Resource views retrieved successfully',
        resourceTotalViews,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding resource with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage, ex);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  saveResourceForUser: async (resourceId: string, userId: string): Promise<ServiceResponse<SavedResource | null>> => {
    try {
      logger.info(`Attempting to save resource with id ${resourceId} for user with id ${userId}`);
      const resource = await resourceRepository.findResourceAsync(resourceId);
      const alreadySavedResource = await resourceRepository.findSavedResourceAsync(resourceId);
      if (alreadySavedResource) {
        return new ServiceResponse(ResponseStatus.Failed, 'Resource already saved', null, StatusCodes.CONFLICT);
      }
      logger.info(`Resource found with id ${resourceId}:`, JSON.stringify(resource));
      if (!resource) {
        logger.info(`No resource found with id ${resourceId}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const savedResource = await resourceRepository.saveResourceAsync(resourceId, userId);
      logger.info(`Resource saved with id ${resourceId} for user with id ${userId}:`, JSON.stringify(savedResource));
      return new ServiceResponse(ResponseStatus.Success, 'Resource saved successfully', savedResource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving resource with id ${resourceId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  findSavedResources: async (userId: string): Promise<ServiceResponse<Resource[] | null>> => {
    try {
      logger.info(`Attempting to find saved resources for user with id ${userId}`);
      //check userID
      logger.info(`userId: ${userId}`);
      const result = await resourceRepository.findSavedResourcesAsync(userId);
      logger.info(`Resources found for user with id ${userId}:`, JSON.stringify(result));
      if (!result) {
        logger.info(`No resources saved for user with id ${userId}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resources saved!', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Resources found for user with id ${userId}`);
      return new ServiceResponse(ResponseStatus.Success, 'Resources saved found', result, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding saved resources for user with id ${userId}: ${ex as Error}`;
      logger.error(errorMessage, ex);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  deleteSavedResource: async (resourceId: string): Promise<ServiceResponse<SavedResource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(resourceId);
      if (!resource) {
        logger.info(`No resource found with id ${resourceId}`);
        return new ServiceResponse(ResponseStatus.Success, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Attempting to delete saved resource`);
      const result = await resourceRepository.deleteSavedResourceAsync(resourceId);
      logger.info(`Resource deleted with id ${resourceId}:`, JSON.stringify(result));
      return new ServiceResponse(ResponseStatus.Success, 'Resource deleted', result, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting resource with id ${resourceId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
