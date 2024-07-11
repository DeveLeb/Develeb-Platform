import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { userService } from '../user/userService';
import { userRepository } from '../user/userRepository';
import { env } from 'src/common/utils/envConfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

export const freejwtRouter: Router = (() => {
  const router = express.Router();
  router.use(bodyParser.json());
  router.post('/', async (req: Request, res: Response) => {
    console.log(req.body)
    const { email } = req.body;
    const user = await userRepository.findByEmailAsync(email);

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  });

  return router;
})();
