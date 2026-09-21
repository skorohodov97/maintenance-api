import { randomUUID } from 'node:crypto';

const maintenanceRequests = [];
const copyRequest = (request) => (request ? { ...request } : null);

const maintenanceRequestRepository = {
  async findAll() {
    return maintenanceRequests.map(copyRequest);
  },

  async findById(id) {
    return copyRequest(maintenanceRequests.find((request) => request.id === id));
  },

  async findByEquipmentId(equipmentId) {
    return maintenanceRequests.filter((request) => request.equipmentId === equipmentId).map(copyRequest);
  },

  async create(data) {
    const timestamp = new Date().toISOString();
    const request = { id: randomUUID(), createdAt: timestamp, updatedAt: timestamp, ...data };
    maintenanceRequests.push(request);
    return copyRequest(request);
  },

  async update(id, data) {
    const requestIndex = maintenanceRequests.findIndex((request) => request.id === id);
    if (requestIndex === -1) return null;

    const updatedRequest = {
      ...maintenanceRequests[requestIndex],
      ...data,
      id,
      createdAt: maintenanceRequests[requestIndex].createdAt,
      updatedAt: new Date().toISOString(),
    };
    maintenanceRequests[requestIndex] = updatedRequest;
    return copyRequest(updatedRequest);
  },

  async delete(id) {
    const requestIndex = maintenanceRequests.findIndex((request) => request.id === id);
    if (requestIndex === -1) return null;
    return copyRequest(maintenanceRequests.splice(requestIndex, 1)[0]);
  },
};

export default maintenanceRequestRepository;