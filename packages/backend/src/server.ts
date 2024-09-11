import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { eventRouter } from './api/event/eventRouter';
import { healthCheckRouter } from './api/healthCheck/healthCheckRouter';
import { jobRouter } from './api/job/jobRouter';
import { resourceRouter } from './api/resources/resourceRouter';
import { tagsRouter } from './api/tags/tagsRouter';
import { userRouter } from './api/user/userRouter';
import { openAPIRouter } from './api-docs/openAPIRouter';
import passport from './common/middleware/authConfig/passport';
import errorHandler from './common/middleware/errorHandler';
import rateLimiter from './common/middleware/rateLimiter';
import requestLogger from './common/middleware/requestLogger';
import { env } from './common/utils/envConfig';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(passport.initialize());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', userRouter);
app.use('/jobs', jobRouter);
app.use('/resources', resourceRouter);
app.use('/events', eventRouter);
app.use('/tags', tagsRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
