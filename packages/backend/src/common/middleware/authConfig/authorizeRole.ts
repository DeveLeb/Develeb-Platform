import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/api/user/userModel';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';

import { Roles } from './roles';

const authorizeRole = (role: Roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info('Authorizing user...');
    const currentUser = req.user as User;
    logger.info('Checking if user is logged in');
    if (!currentUser) {
      logger.error('User is not logged in');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', { error: info }, StatusCodes.UNAUTHORIZED));
    }
    logger.info('User logged in , checking if user has the correct role');
    if (currentUser.role !== role) {
      logger.info('User does not have the required role');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', { error: info }, StatusCodes.UNAUTHORIZED));
    }
    logger.info('User authorized');
    next();
  };
};

export default authorizeRole;
