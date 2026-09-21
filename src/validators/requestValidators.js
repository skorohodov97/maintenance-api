import { isDate, isIntegerInRange, isNonEmptyString, isOneOf, isUuid } from './common.js';

const priorities = ['low', 'medium', 'high'];
const requestStatuses = ['new', 'in_progress', 'done', 'rejected'];

const requestFields = {
  equipmentId: { validate: isUuid },
  title: { validate: isNonEmptyString },
  description: { validate: isNonEmptyString },
  priority: { validate: isOneOf(priorities) },
  status: { validate: isOneOf(requestStatuses) },
  plannedAt: { validate: isDate },
};

const requiredRequestBody = {
  allowUnknown: false,
  fields: Object.fromEntries(
    Object.entries(requestFields)
      .filter(([field]) => field !== 'status')
      .map(([field, rules]) => [field, { ...rules, required: true }]),
  ),
};

const updateRequestBody = {
  allowUnknown: false,
  requireAtLeastOne: true,
  fields: Object.fromEntries(
    Object.entries(requestFields).filter(([field]) => field !== 'status'),
  ),
};

const requestStatusBody = {
  allowUnknown: false,
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
    dateFrom: { validate: isDate },
    dateTo: { validate: isDate },
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