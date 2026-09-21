import express from 'express';
import equipmentRouter from './routes/equipmentRoutes.js';
import maintenanceRequestRouter from './routes/maintenanceRequestRoutes.js';
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/equipment', equipmentRouter);
app.use('/api/requests', maintenanceRequestRouter);
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
