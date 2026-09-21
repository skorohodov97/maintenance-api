import equipmentRepository from '../repositories/equipmentRepository.js';
import { ConflictError } from '../errors/index.js';

const ensureUniqueSerialNumber = async (serialNumber, equipmentId) => {
  if (serialNumber === undefined) {
    return;
  }

  const equipmentItems = await equipmentRepository.findAll();
  const duplicate = equipmentItems.find(
    (equipment) => equipment.serialNumber === serialNumber && equipment.id !== equipmentId,
  );

  if (duplicate) {
    throw new ConflictError('Equipment with this serial number already exists');
  }
};

const getPositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const equipmentService = {
  async getAllEquipment(query = {}) {
    const page = getPositiveInteger(query.page, 1);
    const limit = getPositiveInteger(query.limit, 10);
    const equipmentItems = await equipmentRepository.findAll();
    let filteredEquipment = equipmentItems.filter((equipment) => {
      const hasMatchingStatus = !query.status || equipment.status === query.status;
      const hasMatchingType = !query.type || equipment.type === query.type;

      return hasMatchingStatus && hasMatchingType;
    });

    if (query.sort === 'name') {
      filteredEquipment = filteredEquipment.sort((first, second) =>
        String(first.name || '').localeCompare(String(second.name || '')),
      );
    }

    const total = filteredEquipment.length;
    const startIndex = (page - 1) * limit;

    return {
      data: filteredEquipment.slice(startIndex, startIndex + limit),
      meta: {
        total,
        page,
        limit,
      },
    };
  },

  async getEquipmentById(id) {
    return equipmentRepository.findById(id);
  },

  async createEquipment(data) {
    await ensureUniqueSerialNumber(data.serialNumber);

    return equipmentRepository.create(data);
  },

  async updateEquipment(id, data) {
    const equipment = await equipmentRepository.findById(id);

    if (!equipment) {
      return null;
    }

    await ensureUniqueSerialNumber(data.serialNumber, id);

    return equipmentRepository.update(id, data);
  },

  async deleteEquipment(id) {
    return equipmentRepository.delete(id);
  },
};

export default equipmentService;
