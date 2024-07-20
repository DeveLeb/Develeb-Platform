import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { GetResourceSchema, GetResourceViews, ResourceSchema } from './resourceModel';
import { resouceService } from './resourceService';

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

  router.post('/', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const { title, description, link, publish, type, tags } = req.body;
    const serviceResponse = await resouceService.createResource(title, description, link, publish, type, tags);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{id}',
    tags: ['Resource'],
    request: { params: GetResourceSchema.shape.params },
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await resouceService.findResourceById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const { title, description, link, publish, type, tags } = req.body;
    const serviceResponse = await resouceService.updateResource(id, title, description, link, publish, type, tags);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const serviceResponse = await resouceService.deleteResource(id);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'get',
    path: '/resources/{id}/views',
    tags: ['Resource'],
    request: { params: GetResourceSchema.shape.params },
    responses: createApiResponse(GetResourceViews, 'Success'),
  });

  router.get('/:id/views', async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await resouceService.findResourceViews(id);
    handleServiceResponse(serviceResponse, res);
  });

  resourceRegistry.registerPath({
    method: 'post',
    path: '/resources/{resourceId}/save/{userId}',
    tags: ['Resource'],
    responses: createApiResponse(ResourceSchema, 'Success'),
  });

  router.post('/:resourceId/save/:userId', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }
    const { resourceId, userId } = req.params;
    const serviceResponse = await resouceService.saveResourceForUser(resourceId, userId);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
