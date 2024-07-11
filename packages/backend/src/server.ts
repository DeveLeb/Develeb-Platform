import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from './api/healthCheck/healthCheckRouter';
import { userRouter } from './api/user/userRouter';
import {freejwtRouter} from './api/user/freejwtRouter'
import { openAPIRouter } from './api-docs/openAPIRouter';
import errorHandler from './common/middleware/errorHandler';
import rateLimiter from './common/middleware/rateLimiter';
import requestLogger from './common/middleware/requestLogger';
import { env } from './common/utils/envConfig';
import passport from './common/middleware/authConfig/passport';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(passport.initialize());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', userRouter);
app.use('/login', freejwtRouter);
// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
