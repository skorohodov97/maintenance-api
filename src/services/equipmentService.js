import equipmentRepository from '../repositories/equipmentRepository.js';

const ensureUniqueSerialNumber = async (serialNumber, equipmentId) => {
  if (serialNumber === undefined) {
    return;
  }

  const equipmentItems = await equipmentRepository.findAll();
  const duplicate = equipmentItems.find(
    (equipment) => equipment.serialNumber === serialNumber && equipment.id !== equipmentId,
  );

  if (duplicate) {
    const error = new Error('Equipment with this serial number already exists');
    error.code = 'DUPLICATE_SERIAL_NUMBER';

    throw error;
  }
};

const equipmentService = {
  async getAllEquipment() {
    return equipmentRepository.findAll();
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
