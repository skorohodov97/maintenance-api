import { Router } from 'express';
import {
  createEquipment,
  deleteEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
} from '../controllers/equipmentController.js';
import { getRequestsByEquipmentId } from '../controllers/maintenanceRequestController.js';
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
  .get(validateRequest({ query: equipmentQuery }), getEquipment)
  .post(validateRequest({ body: requiredEquipmentBody }), createEquipment);
equipmentRouter.get(
  '/:id/requests',
  validateRequest({ params: equipmentIdParams }),
  getRequestsByEquipmentId,
);
equipmentRouter
  .route('/:id')
  .get(validateEquipmentId, getEquipmentById)
  .patch(validateEquipmentId, validateRequest({ body: updateEquipmentBody }), updateEquipment)
  .delete(validateEquipmentId, deleteEquipment);

export default equipmentRouter;