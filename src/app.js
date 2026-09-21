import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import equipmentRouter from './routes/equipmentRoutes.js';
import maintenanceRequestRouter from './routes/maintenanceRequestRoutes.js';
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';
import requestIdMiddleware from './middlewares/requestIdMiddleware.js';
import requestLoggingMiddleware from './middlewares/requestLoggingMiddleware.js';
import config from './config/index.js';

const app = express();

app.use(requestIdMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowed = !origin || config.corsOrigins.includes(origin);

      callback(null, isAllowed);
    },
  }),
);
app.use(requestLoggingMiddleware);
app.use(express.json({ limit: config.jsonBodyLimit }));

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/equipment', equipmentRouter);
app.use('/api/requests', maintenanceRequestRouter);
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
