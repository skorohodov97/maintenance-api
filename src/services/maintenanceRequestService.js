import equipmentRepository from '../repositories/equipmentRepository.js';
import maintenanceRequestRepository from '../repositories/maintenanceRequestRepository.js';

const ensureEquipmentExists = async (equipmentId) => {
  const equipment = await equipmentRepository.findById(equipmentId);

  if (!equipment) {
    const error = new Error('Equipment not found');
    error.code = 'EQUIPMENT_NOT_FOUND';

    throw error;
  }
};

const maintenanceRequestService = {
  async getAllRequests() {
    return maintenanceRequestRepository.findAll();
  },

  async getRequestById(id) {
    return maintenanceRequestRepository.findById(id);
  },

  async getRequestsByEquipmentId(equipmentId) {
    await ensureEquipmentExists(equipmentId);

    return maintenanceRequestRepository.findByEquipmentId(equipmentId);
  },

  async createRequest(data) {
    await ensureEquipmentExists(data.equipmentId);

    return maintenanceRequestRepository.create(data);
  },

  async updateRequest(id, data) {
    const request = await maintenanceRequestRepository.findById(id);

    if (!request) {
      return null;
    }

    if (data.equipmentId !== undefined) {
      await ensureEquipmentExists(data.equipmentId);
    }

    return maintenanceRequestRepository.update(id, data);
  },

  async deleteRequest(id) {
    return maintenanceRequestRepository.delete(id);
  },
};

export default maintenanceRequestService;
