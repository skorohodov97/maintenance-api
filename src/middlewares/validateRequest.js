import { ValidationError } from '../errors/index.js';

const validateRequest = (schemas) => (request, response, next) => {
  const details = Object.entries(schemas).flatMap(([source, schema]) => {
    const value = request[source] ?? {};
    const sourceDetails = [];

    if (schema.allowUnknown === false) {
      const unknownFields = Object.keys(value).filter((field) => !schema.fields[field]);

      sourceDetails.push(
        ...unknownFields.map((field) => ({
          field: `${source}.${field}`,
          message: 'is not allowed',
        })),
      );
    }

    for (const [field, rules] of Object.entries(schema.fields)) {
      const fieldValue = value[field];

      if (rules.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
        sourceDetails.push({ field: `${source}.${field}`, message: 'is required' });
        continue;
      }

      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        const message = rules.validate?.(fieldValue);

        if (message) {
          sourceDetails.push({ field: `${source}.${field}`, message });
        }
      }
    }

    if (schema.requireAtLeastOne && Object.keys(value).length === 0) {
      sourceDetails.push({ field: source, message: 'must contain at least one field' });
    }

    return sourceDetails;
  });

  if (details.length > 0) {
    return next(new ValidationError('Request validation failed', details));
  }

  return next();
};

export default validateRequest;