import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { User } from 'src/api/user/userModel';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { handleServiceResponse } from 'src/common/utils/httpHandlers';
import { logger } from 'src/server';
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Authenticating user...');
  passport.authenticate('jwt', { session: false }, (err: string, user: User, info: string) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      logger.info('User unauthorized');
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Unauthorized', 
        { error: info },
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(serviceResponse, res);
    }
    req.user = user;
    logger.info('User authenticated');
    next();
  })(req, res, next);
};

export default authenticate;
