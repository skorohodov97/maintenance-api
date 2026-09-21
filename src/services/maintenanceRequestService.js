import equipmentRepository from '../repositories/equipmentRepository.js';
import maintenanceRequestRepository from '../repositories/maintenanceRequestRepository.js';
import { ConflictError, NotFoundError } from '../errors/index.js';

const ensureEquipmentExists = async (equipmentId) => {
  const equipment = await equipmentRepository.findById(equipmentId);

  if (!equipment) {
    throw new NotFoundError('Equipment not found');
  }
};

const getPositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const getDateTo = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date.setUTCHours(23, 59, 59, 999);
  }

  return date;
};

const sortFields = new Set(['createdAt', 'priority', 'status', 'title']);
const allowedStatusTransitions = {
  new: new Set(['in_progress', 'rejected']),
  in_progress: new Set(['done', 'rejected']),
  done: new Set(),
  rejected: new Set(),
};

const maintenanceRequestService = {
  async getAllRequests(query = {}) {
    const page = getPositiveInteger(query.page, 1);
    const limit = getPositiveInteger(query.limit, 10);
    const dateFrom = query.dateFrom ? new Date(query.dateFrom) : null;
    const dateTo = getDateTo(query.dateTo);
    const maintenanceRequests = await maintenanceRequestRepository.findAll();
    let filteredRequests = maintenanceRequests.filter((maintenanceRequest) => {
      const createdAt = new Date(maintenanceRequest.createdAt);
      const hasMatchingStatus = !query.status || maintenanceRequest.status === query.status;
      const hasMatchingPriority = !query.priority || maintenanceRequest.priority === query.priority;
      const hasMatchingEquipment =
        !query.equipmentId || maintenanceRequest.equipmentId === query.equipmentId;
      const isAfterDateFrom = !dateFrom || createdAt >= dateFrom;
      const isBeforeDateTo = !dateTo || createdAt <= dateTo;

      return (
        hasMatchingStatus &&
        hasMatchingPriority &&
        hasMatchingEquipment &&
        isAfterDateFrom &&
        isBeforeDateTo
      );
    });

    if (sortFields.has(query.sort)) {
      const direction = query.order === 'desc' ? -1 : 1;

      filteredRequests = filteredRequests.sort((first, second) =>
        String(first[query.sort] || '').localeCompare(String(second[query.sort] || '')) * direction,
      );
    }

    const total = filteredRequests.length;
    const startIndex = (page - 1) * limit;

    return {
      data: filteredRequests.slice(startIndex, startIndex + limit),
      meta: {
        total,
        page,
        limit,
      },
    };
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

    return maintenanceRequestRepository.create({
      ...data,
      status: 'new',
    });
  },

  async updateRequest(id, data) {
    const request = await maintenanceRequestRepository.findById(id);

    if (!request) {
      return null;
    }

    if (data.equipmentId !== undefined) {
      await ensureEquipmentExists(data.equipmentId);
    }

    const { status, ...updateData } = data;

    return maintenanceRequestRepository.update(id, updateData);
  },

  async transitionRequestStatus(id, status) {
    const request = await maintenanceRequestRepository.findById(id);

    if (!request) {
      return null;
    }

    if (!allowedStatusTransitions[request.status]?.has(status)) {
      throw new ConflictError(`Cannot change status from ${request.status} to ${status}`);
    }

    return maintenanceRequestRepository.update(id, { status });
  },

  async deleteRequest(id) {
    return maintenanceRequestRepository.delete(id);
  },
};

export default maintenanceRequestService;
