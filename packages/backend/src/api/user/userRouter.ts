import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authenticate from 'src/common/middleware/authConfig/authentication';
import authorizeRole from 'src/common/middleware/authConfig/authorizeRole';
import { env } from 'src/common/utils/envConfig';
import { logger } from 'src/server';
import { z } from 'zod';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { GetUserSchema, UserSchema } from '../user/userModel';
import { userService } from '../user/userService';
import { createUserRequest } from './userRequest/createUserRequest';

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

  router.get('/', authenticate, authorizeRole('admin'), async (_req: Request, res: Response) => {
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

  router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', async (req: Request, res: Response) => {
    const RequestObject = createUserRequest.parse(req.body);
    logger.info('Parsed RequestObject: ', RequestObject);
    const serviceResponse = await userService.createUser(RequestObject);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', authenticate, async (req: Request, res: Response) => {
    const id = req.params.id;
    if (req.user && req.user.id === id) {
      //making sure that the authenticated user is deleting his own account and not someone else's account
      const serviceResponse = await userService.deleteUser(id);
      handleServiceResponse(serviceResponse, res);
    } else {
      res.status(401).json({ message: 'Unauthorized' }); //do like this or create a serviceResponse object, assign it the error code and message and send it to handleserviceresponse?
    }
  });
  router.put('/:id', authenticate, async (req: Request, res: Response) => {
    const { full_name, level_id, category_id, tags } = req.body;
    const id = req.params.id;
    if (req.user && req.user.id === id) {
      const serviceResponse = await userService.updateUser(id, full_name, level_id, category_id, tags);
      handleServiceResponse(serviceResponse, res);
    } else {
      res.status(401).json({ message: 'Unauthorized' }); //do like this or create a serviceResponse object, assign it the error code and message and send it to handleserviceresponse?
    }
  });

  router.post('/login', async (req, res, next) => {
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

        const token = jwt.sign({ id: user[0].id, role: user[0].role }, env.JWT_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign({ id: user[0].id, role: user[0].role }, env.JWT_REFRESH_SECRET, {
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
