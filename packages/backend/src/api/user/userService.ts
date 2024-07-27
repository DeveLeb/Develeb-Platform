import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { validatePassword } from 'src/common/utils/commonValidation';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import { User } from './userModel';
import { userRepository } from './userRepository';
import { CreateUserRequest, createUserRequest } from './userRequest/createUser';

export const userService = {
  // Retrieves all users from the database
  findAll: async (): Promise<ServiceResponse<User[] | null>> => {
    try {
      const users = await userRepository.findAllAsync();
      if (!users) {
        logger.info('No users found');
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
  createUser: async (createUserRequest: CreateUserRequest): Promise<ServiceResponse<User | null>> => {
    try {
      logger.info('Validating password...');
      const { valid, message } = validatePassword(createUserRequest.password);
      if (!valid) {
        logger.info(`Password validation failed: ${message}`);
        return new ServiceResponse(ResponseStatus.Failed, message as string, null, StatusCodes.BAD_REQUEST);
      }
      logger.info('Checking for conflicts...');
      const userEmail = await userRepository.findByEmailAsync(createUserRequest.email);
      if (userEmail) {
        logger.info('Email conflict found');
        return new ServiceResponse(ResponseStatus.Success, 'Email already in use.', null, StatusCodes.CONFLICT);
      }
      logger.info('No email conflicts found. Checking for username...');
      const userUsername = await userRepository.findByUsernameAsync(createUserRequest.username);
      if (userUsername) {
        logger.info('Username conflict found');
        return new ServiceResponse(ResponseStatus.Success, 'Username already in use.', null, StatusCodes.CONFLICT);
      }
      logger.info('No conflicts found. Creating user...');
      const hashPassword = await bcrypt.hash(createUserRequest.password, 4);
      createUserRequest.password = hashPassword;
      const newUser = await userRepository.createUserAsync(createUserRequest);
      logger.info('User created successfully');
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
      return new ServiceResponse<User>(ResponseStatus.Success, 'User deleted', user, StatusCodes.OK);
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
};
