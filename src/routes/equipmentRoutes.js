import { Router } from 'express';
import {
  createEquipment,
  deleteEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
} from '../controllers/equipmentController.js';
import { getRequestsByEquipmentId } from '../controllers/maintenanceRequestController.js';

const equipmentRouter = Router();

equipmentRouter.route('/').get(getEquipment).post(createEquipment);
equipmentRouter.get('/:id/requests', getRequestsByEquipmentId);
equipmentRouter
  .route('/:id')
  .get(getEquipmentById)
  .patch(updateEquipment)
  .delete(deleteEquipment);

export default equipmentRouter;
