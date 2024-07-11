import { Request } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { userRepository } from 'src/api/user/userRepository';

import { env } from '../utils/envConfig';

// Define your JWT payload type
interface JwtPayload {
  id: string;
  role: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload: JwtPayload, done) => {
    try {
      const user = await userRepository.findByIdAsync(jwtPayload.id);
      console.log('user at passport: ', user)
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
