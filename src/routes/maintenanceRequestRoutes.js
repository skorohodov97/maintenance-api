import { Router } from 'express';
import {
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
  updateRequestStatus,
} from '../controllers/maintenanceRequestController.js';

const maintenanceRequestRouter = Router();

maintenanceRequestRouter.route('/').get(getRequests).post(createRequest);
maintenanceRequestRouter.patch('/:id/status', updateRequestStatus);
maintenanceRequestRouter
  .route('/:id')
  .get(getRequestById)
  .patch(updateRequest)
  .delete(deleteRequest);

export default maintenanceRequestRouter;
