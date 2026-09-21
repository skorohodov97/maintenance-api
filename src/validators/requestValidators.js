import {
  isIntegerInRange,
  isIsoDate,
  isIsoDateTime,
  isOneOf,
  isStringLength,
  isStringUpTo,
  isUuid,
} from './common.js';

const priorities = ['low', 'medium', 'high', 'critical'];
const requestStatuses = ['new', 'in_progress', 'done', 'rejected'];

const requestFields = {
  equipmentId: { validate: isUuid },
  title: { validate: isStringLength(5, 120) },
  description: { validate: isStringUpTo(2000) },
  priority: { validate: isOneOf(priorities) },
  plannedAt: { validate: isIsoDateTime },
};

const requiredRequestBody = {
  stripUnknown: true,
  fields: {
    equipmentId: { ...requestFields.equipmentId, required: true },
    title: { ...requestFields.title, required: true },
    description: requestFields.description,
    priority: { ...requestFields.priority, required: true },
    plannedAt: requestFields.plannedAt,
  },
};

const updateRequestBody = {
  stripUnknown: true,
  requireAtLeastOne: true,
  fields: requestFields,
};

const requestStatusBody = {
  stripUnknown: true,
  fields: { status: { required: true, validate: isOneOf(requestStatuses) } },
};

const requestIdParams = {
  allowUnknown: false,
  fields: { id: { required: true, validate: isUuid } },
};

const requestQuery = {
  allowUnknown: false,
  fields: {
    page: { validate: isIntegerInRange(1, Number.MAX_SAFE_INTEGER) },
    limit: { validate: isIntegerInRange(1, 100) },
    equipmentId: { validate: isUuid },
    status: { validate: isOneOf(requestStatuses) },
    priority: { validate: isOneOf(priorities) },
    dateFrom: { validate: isIsoDate },
    dateTo: { validate: isIsoDate },
    sort: { validate: isOneOf(['createdAt', 'priority', 'status', 'title']) },
    order: { validate: isOneOf(['asc', 'desc']) },
  },
};

export {
  requestIdParams,
  requestQuery,
  requestStatusBody,
  requiredRequestBody,
  updateRequestBody,
};