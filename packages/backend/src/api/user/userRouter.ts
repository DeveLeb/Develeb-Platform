import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { GetUserSchema, UserSchema } from '../user/userModel';
import { userService } from '../user/userService';
import passport from 'passport';
import authenticate from 'src/common/middleware/authConfig/authentication';
import authorizeRole from 'src/common/middleware/authConfig/authorizeRole';
import bodyParser from 'body-parser';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();
  router.use(bodyParser.json());
  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get(
    '/:id',
    authenticate,
    authorizeRole('admin'),
    validateRequest(GetUserSchema),
    async (req: Request, res: Response) => {
      //const id = parseInt(req.params.id as string, 10);
      const id = req.params.id;
      const serviceResponse = await userService.findById(id);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
