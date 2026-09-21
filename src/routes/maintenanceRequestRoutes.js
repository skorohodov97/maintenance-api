import { Router } from 'express';
import {
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
  updateRequestStatus,
} from '../controllers/maintenanceRequestController.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
  requestIdParams,
  requestQuery,
  requestStatusBody,
  requiredRequestBody,
  updateRequestBody,
} from '../validators/requestValidators.js';

const maintenanceRequestRouter = Router();

const validateRequestId = validateRequest({ params: requestIdParams });

maintenanceRequestRouter
  .route('/')
  .get(validateRequest({ query: requestQuery }), getRequests)
  .post(validateRequest({ body: requiredRequestBody }), createRequest);
maintenanceRequestRouter.patch(
  '/:id/status',
  validateRequest({ params: requestIdParams, body: requestStatusBody }),
  updateRequestStatus,
);
maintenanceRequestRouter
  .route('/:id')
  .get(validateRequestId, getRequestById)
  .patch(validateRequestId, validateRequest({ body: updateRequestBody }), updateRequest)
  .delete(validateRequestId, deleteRequest);

export default maintenanceRequestRouter;