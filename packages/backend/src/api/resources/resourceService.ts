import { eq, SQL } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { resource } from 'src/db/schema';
import { logger } from 'src/server';

import { Resource } from './resourceModel';
import { resourceRepository } from './resourceRepository';

type PaginationInfo = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const resouceService = {
  findResources: async (params: {
    pageIndex: string;
    pageSize: string;
    type?: string;
    title?: string;
  }): Promise<ServiceResponse<{ resources: Resource[]; pagination: PaginationInfo } | null>> => {
    try {
      const page = parseInt(params.pageIndex, 10) || 1;
      const limit = parseInt(params.pageSize, 10) || 10;
      const offset = (page - 1) * limit;
      const conditions: SQL[] = [];
      if (params.type) {
        conditions.push(eq(resource.type, params.type));
      }
      if (params.title) {
        conditions.push(eq(resource.title, params.title));
      }
      let totalCount: number, resources: Resource[];
      // eslint-disable-next-line prefer-const
      [totalCount, resources] = await Promise.all([
        resourceRepository.findResourcesCountAsync(conditions),
        resourceRepository.findResourcesAsync(conditions, limit, offset),
      ]);
      if (!Array.isArray(resources)) {
        resources = [resources as Resource];
      }
      if (resources.length === 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resources found', null, StatusCodes.NOT_FOUND);
      }
      const paginationInfo: PaginationInfo = {
        currentPage: page,
        pageSize: limit,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
      const successMessage = `Resources fetched successfully. Page ${page} of ${paginationInfo.totalPages}. Total resources: ${totalCount}`;
      const responseData = {
        resources: resources,
        pagination: paginationInfo,
      };
      return new ServiceResponse(ResponseStatus.Success, successMessage, responseData, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding resources: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  //////////////////////////////////////
  createResource: async (
    title: string,
    description: string,
    link: string,
    publish: boolean,
    type: string,
    tags: string
  ): Promise<ServiceResponse<Resource | null>> => {
    try {
      const createdResource = await resourceRepository.createResourceAsync(
        title,
        description,
        link,
        publish,
        type,
        tags
      );
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
        return new ServiceResponse(ResponseStatus.Failed, 'No resouce found', null, StatusCodes.NOT_FOUND);
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
    title: string,
    description: string,
    link: string,
    publish: boolean,
    type: string,
    tags: string
  ): Promise<ServiceResponse<Resource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(id);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resouce found', null, StatusCodes.NOT_FOUND);
      }
      const updatedResource = await resourceRepository.updateResourceAsync(
        id,
        title,
        description,
        link,
        publish,
        type,
        tags
      );
      return new ServiceResponse(ResponseStatus.Failed, 'No resouce found', updatedResource, StatusCodes.NOT_FOUND);
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
        return new ServiceResponse(ResponseStatus.Failed, 'No resouce found', null, StatusCodes.NOT_FOUND);
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
  saveResourceForUser: async (resouceId: string, userId: string): Promise<ServiceResponse<Resource | null>> => {
    try {
      const resource = await resourceRepository.findResourceAsync(resouceId);
      if (!resource) {
        return new ServiceResponse(ResponseStatus.Failed, 'No resource found', null, StatusCodes.NOT_FOUND);
      }
      const savedResource = await resourceRepository.saveResourceAsync(resouceId, userId);
      return new ServiceResponse(ResponseStatus.Success, 'Resource saved successfully', savedResource, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving resource with id ${resouceId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
