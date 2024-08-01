import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import authenticate from 'src/common/middleware/authConfig/authentication';
import authorizeRole from 'src/common/middleware/authConfig/authorizeRole';
import passport from 'src/common/middleware/authConfig/passport';
import { Roles } from 'src/common/middleware/authConfig/roles';
import { ServiceResponse } from 'src/common/models/serviceResponse';
import { env } from 'src/common/utils/envConfig';
import { logger } from 'src/server';
import { z } from 'zod';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { GetUserSchema, User, UserSchema } from '../user/userModel';
import { userService } from '../user/userService';
import {
  CreateUserRequest,
  CreateUserSchema,
  DeleteUserRequest,
  DeleteUserSchema,
  GetUserRequest,
  GetUsersRequest,
  GetUsersSchema,
  LoginUserRequest,
  LoginUserSchema,
  UpdateUserRequest,
  UpdateUserSchema,
  UserRefreshRequest,
  UserRefreshTokenSchema,
} from './userRequest';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();
  router.use(bodyParser.json());
  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['User'],
    responses: createApiResponse(z.array(GetUserSchema), 'Success'),
  });

  router.get(
    '/',
    validateRequest(GetUsersSchema),
    authenticate,
    authorizeRole(Roles.ADMIN),
    async (req: Request, res: Response) => {
      const serviceResponse = await userService.findAll();
      handleServiceResponse(serviceResponse, res);
    }
  );

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(GetUserSchema, 'Success'),
  });

  router.get('/:id', validateRequest(GetUserSchema), async (req: Request, res: Response) => {
    const id = req.params as unknown as GetUserRequest['id'];
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', validateRequest(CreateUserSchema), async (req: Request, res: Response) => {
    const createUserRequest = req.body as unknown as CreateUserRequest;
    const serviceResponse = await userService.createUser(createUserRequest);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', validateRequest(DeleteUserSchema), authenticate, async (req: Request, res: Response) => {
    const { id } = req.params as unknown as DeleteUserRequest;
    const currentUser = req.user as User | undefined;
    const serviceResponse = await userService.deleteUser(id, currentUser);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', validateRequest(UpdateUserSchema), authenticate, async (req: Request, res: Response) => {
    const { id } = req.params as unknown as UpdateUserRequest['params'];
    const { full_name, level_id, category_id, tags } = req.body as unknown as UpdateUserRequest['body'];
    const currentUser = req.user as User | undefined;
    const serviceResponse = await userService.updateUser(id, full_name, level_id, category_id, tags, currentUser);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/login', validateRequest(LoginUserSchema),  async (req: Request, res: Response, next: NextFunction) => {
    const serviceResponse = await userService.userLogin(req, res, next);
    handleServiceResponse(serviceResponse, res);
  });
  router.post('/refresh-token', validateRequest(UserRefreshTokenSchema), async (req: Request, res: Response) => {
    const { refreshToken } = req.body as unknown as UserRefreshRequest;
    const serviceResponse = await userService.userRefreshToken(refreshToken);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/reset-password', authenticate, async (req: Request, res: Response) => {
    const { id, password } = req.body;
    if (req.user && req.user.id === id) {
      const hashPassword = await bcrypt.hash(password, 1);
      const serviceResponse = await userService.resetPassword(id,password, hashPassword);
      handleServiceResponse(serviceResponse, res);
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });

  return router;
})();
