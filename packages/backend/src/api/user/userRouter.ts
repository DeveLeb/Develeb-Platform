import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authenticate from 'src/common/middleware/authConfig/authentication';
import authorizeRole from 'src/common/middleware/authConfig/authorizeRole';
import { Roles } from 'src/common/middleware/authConfig/roles';
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
    async (_req: Request, res: Response) => {
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
    const id = req.params as unknown as DeleteUserRequest['id'];
    const currentUser = req.user as User;
    const serviceResponse = await userService.deleteUser(id, currentUser);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', validateRequest(UpdateUserSchema), authenticate, async (req: Request, res: Response) => {
    const { full_name, level_id, category_id, tags } = req.body as unknown as UpdateUserRequest['body'];
    const id = req.params as unknown as UpdateUserRequest['params']['id'];
    if (req.user && req.user.id === id) {
      const serviceResponse = await userService.updateUser(id, full_name, level_id, category_id, tags);
      handleServiceResponse(serviceResponse, res);
    } else {
      res.status(401).json({ message: 'Unauthorized' }); //do like this or create a serviceResponse object, assign it the error code and message and send it to handleserviceresponse?
    }
  });

  router.post('/login', validateRequest(LoginUserSchema), async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({
          message: 'Authentication failed',
          error: info ? info.message : 'Login failed',
        });
      }
      req.login(user, { session: false }, async (err) => {
        if (err) {
          return res.status(401).json({ message: 'Login failed', error: err });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign({ id: user.id, role: user.role }, env.JWT_REFRESH_SECRET, {
          expiresIn: '7d',
        });
        return res.json({ message: 'Login successful', token, refreshToken });
      });
    })(req, res, next);
  });

  router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

      const user = await userService.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Generate new JWT token
      const accessToken = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '15m' });

      return res.json({ accessToken });
    } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
  });

  return router;
})();