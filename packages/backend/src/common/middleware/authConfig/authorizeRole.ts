import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/api/user/userModel';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { handleServiceResponse } from 'src/common/utils/httpHandlers';
import { logger } from 'src/server';

import { Roles } from './roles';

const authorizeRole = (role: Roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authorizing user...');
    const currentUser = req.user as User;
    logger.info('Checking if user is logged in');
    if (!currentUser) {
      logger.error('User is not logged in');
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Unauthorized',
        { error: 'User is unauthorized' },
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(serviceResponse, res);
    }
    logger.info('User logged in , checking if user has the correct role');
    if (currentUser.role !== role) {
      logger.info('User does not have the required role');
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Forbidden',
        { error: 'Forbidden' },
        StatusCodes.FORBIDDEN
      );
      return handleServiceResponse(serviceResponse, res);
    }
    logger.info('User authorized');
    next();
  };
};

export default authorizeRole;
