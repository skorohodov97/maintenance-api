import { Router } from 'express';
import {
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
} from '../controllers/maintenanceRequestController.js';

const maintenanceRequestRouter = Router();

maintenanceRequestRouter.route('/').get(getRequests).post(createRequest);
maintenanceRequestRouter
  .route('/:id')
  .get(getRequestById)
  .patch(updateRequest)
  .delete(deleteRequest);

export default maintenanceRequestRouter;
