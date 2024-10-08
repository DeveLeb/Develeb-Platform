import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { env } from 'src/common/utils/envConfig';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import { User } from './userModel';
import { userRepository } from './userRepository';
import { CreateUserRequest } from './userRequest';
import { UserResponse } from './userResponse';

export const userService = {
  findAll: async (
    pageIndex: number,
    pageSize: number,
    username: string | undefined,
    email: string | undefined
  ): Promise<ServiceResponse<UserResponse[] | null>> => {
    try {
      const users = await userRepository.findAllAsync(pageIndex, pageSize, username, email);
      if (users.length == 0) {
        logger.info('No users found');
        return new ServiceResponse(ResponseStatus.Success, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('Users retuned successfully');
      return new ServiceResponse<UserResponse[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string): Promise<ServiceResponse<UserResponse | null>> => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Success, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('User found');
      return new ServiceResponse<UserResponse>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  createUser: async (createUserRequest: CreateUserRequest): Promise<ServiceResponse<null>> => {
    try {
      logger.info('Checking for conflicts...');
      const userExists = await userRepository.findByUsernameOrEmailAsync(
        createUserRequest.username,
        createUserRequest.email
      );
      if (userExists) {
        logger.info('User exists');
        return new ServiceResponse(ResponseStatus.Success, 'User exists.', null, StatusCodes.CONFLICT);
      }
      logger.info('No conflicts found. Creating user...');
      const hashPassword = await bcrypt.hash(createUserRequest.password, 10);
      createUserRequest.password = hashPassword;
      await userRepository.createUserAsync(createUserRequest);
      logger.info('User created successfully');
      return new ServiceResponse(ResponseStatus.Success, 'User created', null, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteUser: async (id: string): Promise<ServiceResponse<null>> => {
    try {
      logger.info('Fetching user from database...');
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Success, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      await userRepository.deleteUserAsync(id);
      logger.info('User deleted');
      return new ServiceResponse(ResponseStatus.Success, 'User deleted', null, StatusCodes.NO_CONTENT);
    } catch (ex) {
      const errorMessage = `Error deleting user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateUser: async (
    id: string,
    full_name: string,
    level_id: number,
    category_id: number,
    tags: string | undefined
  ): Promise<ServiceResponse<null>> => {
    try {
      logger.info('Fetching user from database...');
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        logger.info('User not found by id.');
        return new ServiceResponse(ResponseStatus.Success, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('User found');
      await userRepository.updateUserAsync(id, full_name, level_id, category_id, tags);
      return new ServiceResponse(ResponseStatus.Success, 'User updated', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  resetPassword: async (id: string, password: string): Promise<ServiceResponse<User | null>> => {
    try {
      logger.info('Fetching user from database...');
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        logger.info('User not found by id.');
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('User found, getting old user password');
      const currentPassword = await userRepository.getPasswordAsync(id);
      if (await bcrypt.compare(password, currentPassword)) {
        logger.info('Password is the same as the current one');
        return new ServiceResponse(
          ResponseStatus.Failed,
          'New password cannot be the same as the old password',
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      logger.info('Password is different from the current one, resetting password...');
      const hashPassword = await bcrypt.hash(password, 4);
      const returnedUser = await userRepository.resetPasswordAsync(id, hashPassword);
      logger.info('Password reset');
      return new ServiceResponse<User>(ResponseStatus.Success, 'Password reset', returnedUser, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error resetting password for user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  userLogin: (req: Request, res: Response, next: NextFunction): Promise<ServiceResponse<any>> => {
    return new Promise((resolve) => {
      passport.authenticate(
        'local',
        { session: false },
        (err: Error | null, user: User, info: { message: string } | null) => {
          if (err || !user) {
            resolve(
              new ServiceResponse(
                ResponseStatus.Failed,
                info ? info.message : 'Authentication failed',
                null,
                StatusCodes.UNAUTHORIZED
              )
            );
          } else {
            req.login(user, { session: false }, async (err) => {
              if (err) {
                resolve(
                  new ServiceResponse(
                    ResponseStatus.Failed,
                    'Login failed',
                    { error: err.message },
                    StatusCodes.UNAUTHORIZED
                  )
                );
              } else {
                const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });

                const refreshToken = jwt.sign({ id: user.id, role: user.role }, env.JWT_REFRESH_SECRET, {
                  expiresIn: '7d',
                });
                resolve(
                  new ServiceResponse(
                    ResponseStatus.Success,
                    'Login successful',
                    { token, refreshToken },
                    StatusCodes.OK
                  )
                );
              }
            });
          }
        }
      )(req, res, next);
    });
  },
  userRefreshToken: async (refreshToken: string): Promise<ServiceResponse<{ token: string } | null>> => {
    logger.info('Checking if refresh token exists...');
    try {
      if (!refreshToken) {
        return new ServiceResponse(ResponseStatus.Failed, 'Refresh token is required', null, StatusCodes.BAD_REQUEST);
      }
      logger.info('Refresh token exists, finding user...');
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string; role: string };
      const user = await userRepository.findByIdAsync(decoded.id);
      if (!user) {
        logger.info('User not found');
        return new ServiceResponse(ResponseStatus.Success, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('User found, refreshing token...');
      const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });
      logger.info('Token refreshed');
      return new ServiceResponse<{ token: string }>(
        ResponseStatus.Success,
        'Token refreshed',
        { token },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error refreshing token: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
