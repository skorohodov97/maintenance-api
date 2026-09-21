import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import config from './config/index.js';
import equipmentRouter from './routes/equipmentRoutes.js';
import maintenanceRequestRouter from './routes/maintenanceRequestRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import requestIdMiddleware from './middlewares/requestIdMiddleware.js';
import requestLoggingMiddleware from './middlewares/requestLoggingMiddleware.js';
import logger from './utils/logger.js';

const app = express();
const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  limit: config.rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (request, response, next, options) => {
    logger.warn('Rate limit exceeded', {
      method: request.method,
      path: request.originalUrl,
      requestId: request.requestId,
    });
    response.status(options.statusCode).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        details: [],
        requestId: request.requestId ?? null,
      },
    });
  },
});

app.use(requestIdMiddleware);
app.use(requestLoggingMiddleware);
app.use(helmet());
app.use(
  cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    origin: (origin, callback) => callback(null, !origin || config.corsOrigins.includes(origin)),
  }),
);
app.use(express.json({ limit: config.jsonBodyLimit }));
app.use('/api', apiRateLimiter);

app.get('/api/health', (request, response) => response.status(200).json({ status: 'ok' }));
app.use('/api/equipment', equipmentRouter);
app.use('/api/requests', maintenanceRequestRouter);
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;