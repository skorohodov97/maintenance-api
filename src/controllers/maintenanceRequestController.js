import maintenanceRequestService from '../services/maintenanceRequestService.js';

const getRequests = async (request, response) => {
  const maintenanceRequests = await maintenanceRequestService.getAllRequests(request.query);

  response.status(200).json(maintenanceRequests);
};

const getRequestById = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.getRequestById(request.params.id);

  if (!maintenanceRequest) {
    return response.status(404).json({ message: 'Maintenance request not found' });
  }

  return response.status(200).json(maintenanceRequest);
};

const getRequestsByEquipmentId = async (request, response) => {
  try {
    const maintenanceRequests = await maintenanceRequestService.getRequestsByEquipmentId(
      request.params.id,
    );

    return response.status(200).json(maintenanceRequests);
  } catch (error) {
    if (error.code === 'EQUIPMENT_NOT_FOUND') {
      return response.status(404).json({ message: error.message });
    }

    throw error;
  }
};

const createRequest = async (request, response) => {
  try {
    const maintenanceRequest = await maintenanceRequestService.createRequest(request.body);

    return response.status(201).json(maintenanceRequest);
  } catch (error) {
    if (error.code === 'EQUIPMENT_NOT_FOUND') {
      return response.status(404).json({ message: error.message });
    }

    throw error;
  }
};

const updateRequest = async (request, response) => {
  try {
    const maintenanceRequest = await maintenanceRequestService.updateRequest(
      request.params.id,
      request.body,
    );

    if (!maintenanceRequest) {
      return response.status(404).json({ message: 'Maintenance request not found' });
    }

    return response.status(200).json(maintenanceRequest);
  } catch (error) {
    if (error.code === 'EQUIPMENT_NOT_FOUND') {
      return response.status(404).json({ message: error.message });
    }

    throw error;
  }
};

const deleteRequest = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.deleteRequest(request.params.id);

  if (!maintenanceRequest) {
    return response.status(404).json({ message: 'Maintenance request not found' });
  }

  return response.status(204).send();
};

export {
  getRequests,
  getRequestById,
  getRequestsByEquipmentId,
  createRequest,
  updateRequest,
  deleteRequest,
};
