import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { ResourceSchema } from './resourceModel';
import {
  CreateResourceRequest,
  CreateResourceSchema,
  DeleteResourceRequest,
  DeleteResourceSchema,
  GetResourceRequest,
  GetResourceSchema,
  GetResourcesRequest,
  GetResourcesSchema,
  GetResourceViewsRequest,
  GetResourceViewsSchema,
  GetUserSavedResourcesRequest,
  GetUserSavedResourcesSchema,
  PutResourceRequest,
  PutResourceSchema,
  SaveResourceRequest,
  SaveResourceSchema,
} from './resourceRequest';
import { GetResourceViewsResponse } from './resourceResponse';
import { resourceService } from './resourceService';

export const resourceRegistry = new OpenAPIRegistry();

resourceRegistry.register('Resource', ResourceSchema);

export const resourceRouter: Router = (() => {
  const router = express.Router();
  resourceRegistry.registerPath({
    method: 'post',
    path: '/resources',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.get('/', validateRequest(GetResourcesSchema), async (req: Request, res: Response) => {
    const { pageIndex, pageSize, type, title } = req.query as unknown as GetResourcesRequest;
    const serviceResponse = await resourceService.findResources({
      pageIndex: pageIndex || 1,
      pageSize: pageSize || 10,
      type: type as string,
      title: title as string,
    });
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'post',
    path: '/resources',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.post('/', validateRequest(CreateResourceSchema), async (req: Request, res: Response) => {
    //TODO auth implementation
    const createResourceRequest = req.body as unknown as CreateResourceRequest;
    const serviceResponse = await resourceService.createResource(createResourceRequest);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{id}/views',
    tags: ['Resource'],
    responses: createApiResponse(GetResourceViewsResponse, 'Success'),
  });

  router.get('/:id/views', validateRequest(GetResourceViewsSchema), async (req: Request, res: Response) => {
    //TODO auth implementation
    const { id } = req.params as unknown as GetResourceViewsRequest;
    const serviceResponse = await resourceService.findResourceViews(id);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'post',
    path: '/resources/{resourceId}/save/{userId}',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.post('/:resourceId/save/:userId', validateRequest(SaveResourceSchema), async (req: Request, res: Response) => {
    //TODO auth implementation
    const { resourceId, userId } = req.params as unknown as SaveResourceRequest;
    const serviceResponse = await resourceService.saveResourceForUser(resourceId, userId);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{userId}/saved/resources',
    tags: ['Job'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.get(
    '/:userId/saved/resources',
    validateRequest(GetUserSavedResourcesSchema),
    async (req: Request, res: Response) => {
      //TODO auth implementation
      const { userId } = req.params as unknown as GetUserSavedResourcesRequest;
      const serviceResponse = await resourceService.findSavedResources(userId);
      handleServiceResponse(serviceResponse, res);
    }
  );
  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{id}',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetResourceSchema), async (req: Request, res: Response) => {
    const { id } = req.params as unknown as GetResourceRequest;
    const serviceResponse = await resourceService.findResourceById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', validateRequest(PutResourceSchema), async (req: Request, res: Response) => {
    //TODO auth implementation
    const { id } = req.params as unknown as PutResourceRequest['params'];
    const putResourceObject = req.body as unknown as PutResourceRequest['body'];
    const serviceResponse = await resourceService.updateResource(id, putResourceObject);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', validateRequest(DeleteResourceSchema), async (req: Request, res: Response) => {
    //TODO auth implementation
    const { id } = req.params as unknown as DeleteResourceRequest;
    const serviceResponse = await resourceService.deleteResource(id);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
