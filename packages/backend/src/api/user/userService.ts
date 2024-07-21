import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import { User } from './userModel';
import { userRepository } from './userRepository';
import bcrypt from 'bcrypt';
export const userService = {
  // Retrieves all users from the database
  findAll: async () => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Users found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User[]>(ResponseStatus.Success, 'Users found', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  findById: async (id: string) => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Creates a new user
  createUser: async (
    email: string,
    username: string,
    password: string,
    full_name: string,
    phone_number: string,
    level_id: number,
    category_id: number
  ) => {
    try {
      const user = await userRepository.findByEmailAsync(email);
      if (user.length !== 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User already exists', null, StatusCodes.CONFLICT);
      }
      const newUser = await userRepository.createUserAsync(
        email,
        username,
        password,
        full_name,
        phone_number,
        level_id,
        category_id
      );
      return new ServiceResponse<User>(ResponseStatus.Success, 'User created', newUser, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteUser: async (id: string) => {
    try {
      console.log(id);
      const user = await userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      await userRepository.deleteUserAsync(id);
      console.log('hrere');
      return new ServiceResponse(ResponseStatus.Success, 'User deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  updateUser: async (id: string, full_name: string, level_id: number, category_id: number, tags: string) => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (user.length == 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      const updatedUser = await userRepository.updateUserAsync(id, full_name, level_id, category_id, tags);
      return new ServiceResponse<User>(ResponseStatus.Success, 'User updated', updatedUser, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  resetPassword: async (id: string, password: string, hashPassword: string) => {
    try {
      const user = await userRepository.findByIdAsync(id);
      if (user.length == 0) {
        return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      }
      const currentPassword = await userRepository.getPasswordAsync(id);
      if (await bcrypt.compare(password, currentPassword)) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'New password cannot be the same as the old password',
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const returnedUser = await userRepository.resetPasswordAsync(id, hashPassword);
      return new ServiceResponse<User>(ResponseStatus.Success, 'Password reset', returnedUser, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error resetting password for user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
