import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const authenticate = (req: Request, res: Response, next: NextFunction) => {

  passport.authenticate('jwt', { session: false }, (err: string, user: string, info: string) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log("user at authentication: ",user)
    req.user = user;
    next();
  })(req, res, next);
};

export default authenticate;
