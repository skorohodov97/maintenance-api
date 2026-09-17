import express from 'express';
import equipmentRouter from './routes/equipmentRoutes.js';

const app = express();

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/equipment', equipmentRouter);

export default app;
