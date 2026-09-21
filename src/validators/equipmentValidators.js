import {
  isIntegerInRange,
  isNotFutureDate,
  isOneOf,
  isStringLength,
  isStringUpTo,
  isUuid,
} from './common.js';

const equipmentTypes = ['turbine', 'inverter', 'sensor', 'substation'];
const equipmentStatuses = ['operational', 'maintenance', 'fault', 'decommissioned'];

const locationValidator = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'must be an object with lat and lon';
  }

  const latitude = Number(value.lat);
  const longitude = Number(value.lon);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return 'lat must be a number between -90 and 90';
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return 'lon must be a number between -180 and 180';
  }

  return null;
};

const equipmentFields = {
  name: { validate: isStringLength(3, 100) },
  type: { validate: isOneOf(equipmentTypes) },
  serialNumber: { validate: isStringLength(1, 255) },
  location: { validate: locationValidator },
  status: { validate: isOneOf(equipmentStatuses) },
  installedAt: { validate: isNotFutureDate },
};

const sanitizeEquipmentBody = (body) => ({
  ...body,
  ...(body.location ? { location: { lat: body.location.lat, lon: body.location.lon } } : {}),
});

const requiredEquipmentBody = {
  stripUnknown: true,
  sanitize: sanitizeEquipmentBody,
  fields: Object.fromEntries(
    Object.entries(equipmentFields).map(([field, rules]) => [field, { ...rules, required: true }]),
  ),
};

const updateEquipmentBody = {
  stripUnknown: true,
  sanitize: sanitizeEquipmentBody,
  requireAtLeastOne: true,
  fields: equipmentFields,
};

const equipmentIdParams = {
  allowUnknown: false,
  fields: { id: { required: true, validate: isUuid } },
};

const equipmentQuery = {
  allowUnknown: false,
  fields: {
    page: { validate: isIntegerInRange(1, Number.MAX_SAFE_INTEGER) },
    limit: { validate: isIntegerInRange(1, 100) },
    status: { validate: isOneOf(equipmentStatuses) },
    type: { validate: isOneOf(equipmentTypes) },
    sort: { validate: isOneOf(['name']) },
  },
};

export { equipmentIdParams, equipmentQuery, requiredEquipmentBody, updateEquipmentBody };