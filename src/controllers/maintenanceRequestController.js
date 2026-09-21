import maintenanceRequestService from '../services/maintenanceRequestService.js';
import { NotFoundError } from '../errors/index.js';

const getRequests = async (request, response) => {
  const maintenanceRequests = await maintenanceRequestService.getAllRequests(request.query);

  response.status(200).json(maintenanceRequests);
};

const getRequestById = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.getRequestById(request.params.id);

  if (!maintenanceRequest) {
    throw new NotFoundError('Maintenance request not found');
  }

  return response.status(200).json(maintenanceRequest);
};

const getRequestsByEquipmentId = async (request, response) => {
  const maintenanceRequests = await maintenanceRequestService.getRequestsByEquipmentId(
    request.params.id,
  );

  return response.status(200).json(maintenanceRequests);
};

const createRequest = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.createRequest(request.body);

  return response.location('/api/requests/' + maintenanceRequest.id).status(201).json(maintenanceRequest);
};

const updateRequest = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.updateRequest(
    request.params.id,
    request.body,
  );

  if (!maintenanceRequest) {
    throw new NotFoundError('Maintenance request not found');
  }

  return response.status(200).json(maintenanceRequest);
};

const updateRequestStatus = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.transitionRequestStatus(
    request.params.id,
    request.body.status,
  );

  if (!maintenanceRequest) {
    throw new NotFoundError('Maintenance request not found');
  }

  return response.status(200).json(maintenanceRequest);
};

const deleteRequest = async (request, response) => {
  const maintenanceRequest = await maintenanceRequestService.deleteRequest(request.params.id);

  if (!maintenanceRequest) {
    throw new NotFoundError('Maintenance request not found');
  }

  return response.status(204).send();
};

export {
  getRequests,
  getRequestById,
  getRequestsByEquipmentId,
  createRequest,
  updateRequest,
  updateRequestStatus,
  deleteRequest,
};
