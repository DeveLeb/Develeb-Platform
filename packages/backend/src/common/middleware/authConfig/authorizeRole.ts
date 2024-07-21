import { NextFunction, Request, Response } from 'express';

const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.role.toLowerCase() !== role.toLowerCase()) {
      console.log(req.user.role);
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export default authorizeRole;
