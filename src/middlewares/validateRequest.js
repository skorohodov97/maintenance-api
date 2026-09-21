import { ValidationError } from '../errors/index.js';

const validateRequest = (schemas) => (request, response, next) => {
  const details = Object.entries(schemas).flatMap(([source, schema]) => {
    const value = request[source] ?? {};
    const normalizedValue = source === 'body' && schema.stripUnknown
      ? Object.fromEntries(Object.entries(value).filter(([field]) => schema.fields[field]))
      : value;
    const sourceDetails = [];

    if (source === 'body' && schema.stripUnknown) {
      request[source] = schema.sanitize?.(normalizedValue) ?? normalizedValue;
    }

    if (schema.allowUnknown === false && source !== 'body') {
      const unknownFields = Object.keys(value).filter((field) => !schema.fields[field]);

      sourceDetails.push(
        ...unknownFields.map((field) => ({
          field: `${source}.${field}`,
          message: 'is not allowed',
        })),
      );
    }

    for (const [field, rules] of Object.entries(schema.fields)) {
      const fieldValue = request[source]?.[field];

      if (rules.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
        sourceDetails.push({ field: `${source}.${field}`, message: 'is required' });
        continue;
      }

      if (fieldValue !== undefined && fieldValue !== null) {
        const message = rules.validate?.(fieldValue);

        if (message) {
          sourceDetails.push({ field: `${source}.${field}`, message });
        }
      }
    }

    if (schema.requireAtLeastOne && Object.keys(request[source] ?? {}).length === 0) {
      sourceDetails.push({ field: source, message: 'must contain at least one editable field' });
    }

    return sourceDetails;
  });

  if (details.length > 0) {
    return next(new ValidationError('Request validation failed', details));
  }

  return next();
};

export default validateRequest;