import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { createApiResponse } from 'src/api-docs/openAPIResponseBuilders';
import authenticate from 'src/common/middleware/authConfig/authentication';
import authorizeRole from 'src/common/middleware/authConfig/authorizeRole';
import { Roles } from 'src/common/middleware/authConfig/roles';
import { handleServiceResponse, validateRequest } from 'src/common/utils/httpHandlers';
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

  router.get('/', validateRequest(TagSchema), async (_req: Request, res: Response) => {
    const serviceResponse = await tagsService.findTags();
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', authenticate, authorizeRole(Roles.ADMIN), async (req: Request, res: Response) => {
    const serviceResponse = await tagsService.createTag(req.body);
    handleServiceResponse(serviceResponse, res);
  });

  tagsRegistry.registerPath({
    method: 'get',
    path: '/tags/:id',
    tags: ['Tag'],
    responses: createApiResponse(TagSchema, 'Success'),
  });

  router.get('/:id', validateRequest(TagSchema), async (req: Request, res: Response) => {
    const { id } = TagSchemaRequest.parse(req.params);
    const serviceResponse = await tagsService.findTagById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put(
    '/:id',
    authenticate,
    authorizeRole(Roles.ADMIN),
    validateRequest(TagSchema),
    async (req: Request, res: Response) => {
      const { id } = TagSchemaRequest.parse(req.params);
      const serviceResponse = await tagsService.updateTag(id, req.body);
      handleServiceResponse(serviceResponse, res);
    }
  );

  router.delete(
    '/id',
    authenticate,
    authorizeRole(Roles.ADMIN),
    validateRequest(TagSchema),
    async (req: Request, res: Response) => {
      const { id } = TagSchemaRequest.parse(req.params);
      const serviceResponse = await tagsService.deleteTag(id);
      handleServiceResponse(serviceResponse, res);
    }
  );
  return router;
})();
