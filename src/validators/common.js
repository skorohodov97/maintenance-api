const isStringLength = (minimum, maximum) => (value) => {
  if (typeof value !== 'string') {
    return 'must be a string';
  }

  const length = value.trim().length;

  return length >= minimum && length <= maximum
    ? null
    : `must contain between ${minimum} and ${maximum} characters`;
};

const isStringUpTo = (maximum) => (value) =>
  typeof value === 'string' && value.length <= maximum
    ? null
    : `must be a string up to ${maximum} characters`;

const isUuid = (value) =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? null
    : 'must be a UUID';

const isIsoDate = (value) =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
    ? null
    : 'must be an ISO date (YYYY-MM-DD)';

const isIsoDateTime = (value) =>
  typeof value === 'string' && value.includes('T') && !Number.isNaN(Date.parse(value))
    ? null
    : 'must be an ISO date-time';

const isNotFutureDate = (value) => {
  const dateError = isIsoDate(value);

  if (dateError) {
    return dateError;
  }

  return new Date(`${value}T00:00:00.000Z`) <= new Date() ? null : 'must not be in the future';
};

const isIntegerInRange = (minimum, maximum) => (value) => {
  const number = Number(value);

  return Number.isInteger(number) && number >= minimum && number <= maximum
    ? null
    : `must be an integer between ${minimum} and ${maximum}`;
};

const isOneOf = (values) => (value) =>
  values.includes(value) ? null : `must be one of: ${values.join(', ')}`;

export {
  isIntegerInRange,
  isIsoDate,
  isIsoDateTime,
  isNotFutureDate,
  isOneOf,
  isStringLength,
  isStringUpTo,
  isUuid,
};