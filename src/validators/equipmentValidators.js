import { isDate, isIntegerInRange, isNonEmptyString, isOneOf, isUuid } from './common.js';

const equipmentStatuses = ['active', 'maintenance', 'inactive'];

const locationValidator = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'must be an object';
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
  name: { validate: isNonEmptyString },
  type: { validate: isNonEmptyString },
  serialNumber: { validate: isNonEmptyString },
  location: { validate: locationValidator },
  status: { validate: isOneOf(equipmentStatuses) },
  installedAt: { validate: isDate },
};

const requiredEquipmentBody = {
  allowUnknown: false,
  fields: Object.fromEntries(
    Object.entries(equipmentFields).map(([field, rules]) => [field, { ...rules, required: true }]),
  ),
};

const updateEquipmentBody = {
  allowUnknown: false,
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
    type: { validate: isNonEmptyString },
    sort: { validate: isOneOf(['name']) },
  },
};

export { equipmentIdParams, equipmentQuery, requiredEquipmentBody, updateEquipmentBody };