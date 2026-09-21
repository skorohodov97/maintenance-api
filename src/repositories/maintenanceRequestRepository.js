import { randomUUID } from 'node:crypto';

const maintenanceRequests = [];

const copyRequest = (request) => (request ? { ...request } : null);

const maintenanceRequestRepository = {
  async findAll() {
    return maintenanceRequests.map(copyRequest);
  },

  async findById(id) {
    const request = maintenanceRequests.find((item) => item.id === id);

    return copyRequest(request);
  },

  async findByEquipmentId(equipmentId) {
    return maintenanceRequests
      .filter((request) => request.equipmentId === equipmentId)
      .map(copyRequest);
  },

  async create(data) {
    const request = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };

    maintenanceRequests.push(request);

    return copyRequest(request);
  },

  async update(id, data) {
    const requestIndex = maintenanceRequests.findIndex((request) => request.id === id);

    if (requestIndex === -1) {
      return null;
    }

    const updatedRequest = {
      ...maintenanceRequests[requestIndex],
      ...data,
      id,
    };

    maintenanceRequests[requestIndex] = updatedRequest;

    return copyRequest(updatedRequest);
  },

  async delete(id) {
    const requestIndex = maintenanceRequests.findIndex((request) => request.id === id);

    if (requestIndex === -1) {
      return null;
    }

    const [deletedRequest] = maintenanceRequests.splice(requestIndex, 1);

    return copyRequest(deletedRequest);
  },
};

export default maintenanceRequestRepository;
