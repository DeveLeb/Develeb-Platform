import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { /* GetResourceViews,*/ ResourceSchema } from './resourceModel';
import {
  CreateResourceRequest,
  CreateResourceSchema,
  GetResourcesRequest,
  GetResourcesSchema,
  PutResourceRequest,
  PutResourceSchema,
} from './resourceRequest';
import { GetResourceViewsSchema } from './resourceResponse';
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
    // if (req.user?.role.toLowerCase() !== 'admin') {
    //   res.status(401).json({ message: 'Unauthorized' });
    // }
    const createResourceRequest = req.body as unknown as CreateResourceRequest;
    const serviceResponse = await resourceService.createResource(createResourceRequest);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{id}',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await resourceService.findResourceById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', validateRequest(PutResourceSchema), async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const putResourceObject = req.body as unknown as PutResourceRequest;
    const serviceResponse = await resourceService.updateResource(id, putResourceObject);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const serviceResponse = await resourceService.deleteResource(id);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{id}/views',
    tags: ['Resource'],
    responses: createApiResponse(GetResourceViewsSchema, 'Success'),
  });

  router.get('/:id/views', async (req: Request, res: Response) => {
    // if (req.user?.role.toLowerCase() !== 'admin') {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }
    const { id } = req.params;
    const serviceResponse = await resourceService.findResourceViews(id);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'post',
    path: '/resources/{resourceId}/save/{userId}',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.post('/:resourceId/save/:userId', async (req: Request, res: Response) => {
    // if (!req.user) {
    //   return res.status(401).send('Unauthorized');
    // }
    const { resourceId, userId } = req.params;
    const serviceResponse = await resourceService.saveResourceForUser(resourceId, userId);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
