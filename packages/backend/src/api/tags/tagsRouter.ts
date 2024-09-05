import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { createApiResponse } from 'src/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from 'src/common/utils/httpHandlers';
import { z } from 'zod';

import { TagSchema, TagSchemaRequest } from './tagsModel';
import { tagsService } from './tagsService';

export const tagsRegistry = new OpenAPIRegistry();
tagsRegistry.register('Tags', TagSchema);

export const tagsRouter: Router = (() => {
  const router = express.Router();
  tagsRegistry.registerPath({
    method: 'get',
    path: '/tags',
    tags: ['Tag'],
    responses: createApiResponse(z.array(TagSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await tagsService.findTags();
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', async (req: Request, res: Response) => {
    const serviceResponse = await tagsService.createTag(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  tagsRegistry.registerPath({
    method: 'get',
    path: '/tags/:id',
    tags: ['Tag'],
    responses: createApiResponse(TagSchema, 'Success'),
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = TagSchemaRequest.parse(req.params);
    const serviceResponse = await tagsService.findTagById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = TagSchemaRequest.parse(req.params);
    const serviceResponse = await tagsService.updateTag(id, req.body);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/id', async (req: Request, res: Response) => {
    const { id } = TagSchemaRequest.parse(req.params);
    const serviceResponse = await tagsService.deleteTag(id);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
