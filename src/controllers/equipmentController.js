import equipmentService from '../services/equipmentService.js';

const getEquipment = async (request, response) => {
  const equipmentItems = await equipmentService.getAllEquipment();

  response.status(200).json(equipmentItems);
};

const getEquipmentById = async (request, response) => {
  const equipment = await equipmentService.getEquipmentById(request.params.id);

  if (!equipment) {
    return response.status(404).json({ message: 'Equipment not found' });
  }

  return response.status(200).json(equipment);
};

const createEquipment = async (request, response) => {
  const equipment = await equipmentService.createEquipment(request.body);

  response.status(201).json(equipment);
};

const updateEquipment = async (request, response) => {
  const equipment = await equipmentService.updateEquipment(request.params.id, request.body);

  if (!equipment) {
    return response.status(404).json({ message: 'Equipment not found' });
  }

  return response.status(200).json(equipment);
};

const deleteEquipment = async (request, response) => {
  const equipment = await equipmentService.deleteEquipment(request.params.id);

  if (!equipment) {
    return response.status(404).json({ message: 'Equipment not found' });
  }

  return response.status(204).send();
};

export {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
