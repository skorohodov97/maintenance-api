const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0 ? null : 'must be a non-empty string';

const isUuid = (value) =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? null
    : 'must be a UUID';

const isDate = (value) =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? null : 'must be a valid date';

const isIntegerInRange = (minimum, maximum) => (value) => {
  const number = Number(value);

  return Number.isInteger(number) && number >= minimum && number <= maximum
    ? null
    : `must be an integer between ${minimum} and ${maximum}`;
};

const isOneOf = (values) => (value) =>
  values.includes(value) ? null : `must be one of: ${values.join(', ')}`;

export { isDate, isIntegerInRange, isNonEmptyString, isOneOf, isUuid };