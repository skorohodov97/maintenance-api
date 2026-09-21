import { Router } from 'express';
import {
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
  updateRequestStatus,
} from '../controllers/maintenanceRequestController.js';
import asyncHandler from '../middlewares/asyncHandler.js';
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
  .get(validateRequest({ query: requestQuery }), asyncHandler(getRequests))
  .post(validateRequest({ body: requiredRequestBody }), asyncHandler(createRequest));
maintenanceRequestRouter.patch(
  '/:id/status',
  validateRequest({ params: requestIdParams, body: requestStatusBody }),
  asyncHandler(updateRequestStatus),
);
maintenanceRequestRouter
  .route('/:id')
  .get(validateRequestId, asyncHandler(getRequestById))
  .patch(validateRequestId, validateRequest({ body: updateRequestBody }), asyncHandler(updateRequest))
  .delete(validateRequestId, asyncHandler(deleteRequest));

export default maintenanceRequestRouter;