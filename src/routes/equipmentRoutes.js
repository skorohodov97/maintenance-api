import { Router } from 'express';
import {
  createEquipment,
  deleteEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
} from '../controllers/equipmentController.js';

const equipmentRouter = Router();

equipmentRouter.route('/').get(getEquipment).post(createEquipment);
equipmentRouter
  .route('/:id')
  .get(getEquipmentById)
  .patch(updateEquipment)
  .delete(deleteEquipment);

export default equipmentRouter;
