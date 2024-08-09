import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from 'src/api/user/userModel';

import { ResponseStatus, ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';
import { Roles } from './authConfig/roles';
export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user as User | undefined;
  if (!user || (user.id !== id && user.role !== Roles.ADMIN)) {
    const serviceResponse = new ServiceResponse(
      ResponseStatus.Failed,
      'Forbidden',
      { error: 'Access forbidden' },
      StatusCodes.FORBIDDEN
    );
    return handleServiceResponse(serviceResponse, res);
  }
  next();
};
