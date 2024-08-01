import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { User } from 'src/api/user/userModel';
import { logger } from 'src/server';
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Authenticating user...');
  passport.authenticate('jwt', { session: false }, (err: string, user: User, info: string) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    logger.info('User authenticated')
    next();
  })(req, res, next);
};

export default authenticate;
