import equipmentService from '../services/equipmentService.js';

const getEquipment = async (request, response) => {
  const equipmentItems = await equipmentService.getAllEquipment(request.query);

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
  try {
    const equipment = await equipmentService.createEquipment(request.body);

    return response.status(201).json(equipment);
  } catch (error) {
    if (error.code === 'DUPLICATE_SERIAL_NUMBER') {
      return response.status(409).json({ message: error.message });
    }

    throw error;
  }
};

const updateEquipment = async (request, response) => {
  try {
    const equipment = await equipmentService.updateEquipment(request.params.id, request.body);

    if (!equipment) {
      return response.status(404).json({ message: 'Equipment not found' });
    }

    return response.status(200).json(equipment);
  } catch (error) {
    if (error.code === 'DUPLICATE_SERIAL_NUMBER') {
      return response.status(409).json({ message: error.message });
    }

    throw error;
  }
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
