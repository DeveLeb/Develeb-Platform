import { and, count, eq } from 'drizzle-orm';
import { UniqueConstraint } from 'drizzle-orm/mysql-core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { resource, resourceSaved, resourceViews } from 'src/db/schema';
import { logger } from 'src/server';

import { db } from '../../db';
import { Resource, ResourceSchema } from './resourceModel';
import { resourceRepository } from './resourceRepository';

// export const getResources = async (req: Request, res: Response) => {
//   try {
//     const { pageIndex = '1', pageSize = '10', type, title } = req.query;
//     const page = parseInt(pageIndex as string, 10) || 1;
//     const limit = parseInt(pageSize as string, 10) || 10;
//     const offset = (page - 1) * limit;
//     const conditions: SQL[] = [];

//     if (typeof type === 'string') {
//       conditions.push(eq(resource.type, type));
//     }
//     if (typeof title === 'string') {
//       conditions.push(eq(resource.title, title));
//     }

//     let baseQuery = db.select().from(resource);
//     if (conditions.length > 0) {
//       baseQuery = baseQuery.where(and(...conditions)) as typeof baseQuery;
//     }

//     const countQuery = db.select({ count: sql<number>`count(*)` }).from(resource);
//     if (conditions.length > 0) {
//       countQuery.where(and(...conditions));
//     }

//     const finalQuery = baseQuery.limit(limit).offset(offset);

//     const [totalCount, result] = await Promise.all([countQuery.execute(), finalQuery.execute()]);

//     if (!totalCount || !result) {
//       throw new Error('Failed to fetch resources');
//     }

//     if (result.length === 0) return res.status(404).json('No resources found');

//     res.json({
//       data: result,
//       pagination: {
//         currentPage: page,
//         pageSize: limit,
//         totalCount: totalCount[0].count,
//         totalPages: Math.ceil(totalCount[0].count / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching resources:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

export const createResource = async (req: Request, res: Response) => {
  try {
    const resourceData = ResourceSchema.safeParse(req.body);
    if (!resourceData.success)
      return res.status(422).json({
        message: 'Validation error',
      });
    const createdResource = db
      .insert(resource)
      .values({
        title: resourceData.data.title,
        description: resourceData.data.description,
        link: resourceData.data.link,
        publish: resourceData.data.publish,
        type: resourceData.data.type,
        tags: resourceData.data.tags,
      })
      .returning();
    res.status(202).json({
      message: 'Resource created succesfully',
      resource: (createdResource as any)[0],
    });
  } catch (error) {
    res.status(500).json('internal server error');
  }
};

export const getResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'resource ID is required' });
    }

    const foundResource = await db.query.resource.findFirst({
      where: eq(resource.id, id),
    });

    if (!foundResource) {
      return res.status(404).json({ message: 'resource not found' });
    }

    return res.status(200).json(foundResource);
  } catch (error) {
    logger.error('Error fetching resource', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  if (!req.user || req.user.role.toLowerCase() != 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: 'bad request' });
    const resourceData = ResourceSchema.safeParse(req.body);
    if (!resourceData.success) return res.status(422).json({ msg: 'Invalid inputs' });
    const updatedResource = await db
      .update(resource)
      .set({
        ...resourceData.data,
      })
      .where(eq(resource.id, id))
      .returning();
    res.status(200).json({
      message: 'Resource updated succesfully',
      resource: updatedResource,
    });
  } catch (error) {
    logger.error('error updating resource:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: 'bad request' });
    const deletedResource = await db.delete(resource).where(eq(resource.id, id)).returning();
    if (deletedResource.length === 0) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(200).json({
      message: 'Resource deleted successfully',
      resource: deletedResource[0],
    });
  } catch (error) {
    logger.error('Error deleting resource:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

async function getTotalViews(Id: string): Promise<number | null> {
  const result = await db.select({ totalViews: count() }).from(resourceViews).where(eq(resourceViews.resourceId, Id));

  return result.length > 0 ? result[0].totalViews : null;
}

export const getResourceViews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Resource ID is required' });

    const totalViews = await getTotalViews(id);

    if (totalViews === null) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ resource_id: id, totalViews });
  } catch (error) {
    logger.error('Error fetching total views:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveResource = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { resourceId } = req.params;
    if (!resourceId) {
      return res.status(400).json({ msg: 'bad request' });
    }
    const userId = req.user.id;
    const existingSave = await db
      .select()
      .from(resourceSaved)
      .where(and(eq(resourceSaved.resourceId, resourceId), eq(resourceSaved.userId, userId)))
      .limit(1);

    if (existingSave.length > 0) {
      return res.status(409).json({ message: 'Resource already saved' });
    }
    const savedResource = await db
      .insert(resourceSaved)
      .values({ resourceId, userId, savedAt: new Date() })
      .returning();
    if (savedResource.length === 0) return res.status(422).json({ msg: 'something went wrong' });

    res.status(200).json({ savedResource, message: 'Resource saved successfully' });
  } catch (error) {
    logger.error('Error saving resource:', error);

    if (error instanceof UniqueConstraint) {
      return res.status(409).json({ message: 'Resource already saved' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resouceService = {
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
