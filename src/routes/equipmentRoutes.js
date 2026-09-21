import { Router } from 'express';
import {
  createEquipment,
  deleteEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
} from '../controllers/equipmentController.js';
import { getRequestsByEquipmentId } from '../controllers/maintenanceRequestController.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
  equipmentIdParams,
  equipmentQuery,
  requiredEquipmentBody,
  updateEquipmentBody,
} from '../validators/equipmentValidators.js';

const equipmentRouter = Router();

const validateEquipmentId = validateRequest({ params: equipmentIdParams });

equipmentRouter
  .route('/')
  .get(validateRequest({ query: equipmentQuery }), asyncHandler(getEquipment))
  .post(validateRequest({ body: requiredEquipmentBody }), asyncHandler(createEquipment));
equipmentRouter.get(
  '/:id/requests',
  validateRequest({ params: equipmentIdParams }),
  asyncHandler(getRequestsByEquipmentId),
);
equipmentRouter
  .route('/:id')
  .get(validateEquipmentId, asyncHandler(getEquipmentById))
  .patch(validateEquipmentId, validateRequest({ body: updateEquipmentBody }), asyncHandler(updateEquipment))
  .delete(validateEquipmentId, asyncHandler(deleteEquipment));

export default equipmentRouter;