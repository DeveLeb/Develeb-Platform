import bcrypt from 'bcrypt';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { userRepository } from 'src/api/user/userRepository';
import { logger } from 'src/server';

import { env } from '../../utils/envConfig';

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
      logger.info('Getting user from database by id...')
      const user = await userRepository.findByIdAsync(jwtPayload.id);

      if (user) {
      logger.info('User found');
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email: string, password: string, done) => {
      try {
        logger.info('Checking for email existence...');
        const user = await userRepository.findByEmailAsync(email);
        if (!user) {
          logger.info('Email not found');
          return done(null, false, { message: 'Incorrect email.' });
        }
        logger.info('Email found');
        logger.info('Comparing passwords...')
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          logger.info('Password incorrect')
          return done(null, false, { message: 'Incorrect password.' });
        }
        logger.info('Password matching');
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
export default passport;
