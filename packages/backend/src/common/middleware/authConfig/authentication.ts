import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { User } from 'src/api/user/userModel';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { logger } from 'src/server';
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Authenticating user...');
  passport.authenticate('jwt', { session: false }, (err: string, user: User, info: string) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      logger.info('User unauthorized');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new ServiceResponse(ResponseStatus.Failed, 'Unauthorized', { error: info }, StatusCodes.UNAUTHORIZED));
    }
    req.user = user;
    logger.info('User authenticated')
    next();
  })(req, res, next);
};

export default authenticate;
