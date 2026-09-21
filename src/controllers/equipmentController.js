import equipmentService from '../services/equipmentService.js';
import { NotFoundError } from '../errors/index.js';

const getEquipment = async (request, response) => {
  const equipmentItems = await equipmentService.getAllEquipment(request.query);

  response.status(200).json(equipmentItems);
};

const getEquipmentById = async (request, response) => {
  const equipment = await equipmentService.getEquipmentById(request.params.id);

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }

  return response.status(200).json(equipment);
};

const getEquipmentWeather = async (request, response) => {
  const weather = await equipmentService.getWeatherById(request.params.id);

  if (!weather) {
    throw new NotFoundError('Equipment not found');
  }

  return response.status(200).json(weather);
};

const createEquipment = async (request, response) => {
  const equipment = await equipmentService.createEquipment(request.body);

  return response.location('/api/equipment/' + equipment.id).status(201).json(equipment);
};

const updateEquipment = async (request, response) => {
  const equipment = await equipmentService.updateEquipment(request.params.id, request.body);

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }

  return response.status(200).json(equipment);
};

const deleteEquipment = async (request, response) => {
  const equipment = await equipmentService.deleteEquipment(request.params.id);

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }

  return response.status(204).send();
};

export {
  getEquipment,
  getEquipmentById,
  getEquipmentWeather,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};