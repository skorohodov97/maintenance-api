import { AppError } from '../errors/index.js';

const errorHandler = (error, request, response, next) => {
  const isPayloadTooLarge = error.type === 'entity.too.large';
  const isAppError = error instanceof AppError;
  const statusCode = isPayloadTooLarge ? 413 : isAppError ? error.statusCode : 500;
  const code = isPayloadTooLarge
    ? 'PAYLOAD_TOO_LARGE'
    : isAppError
      ? error.code
      : 'INTERNAL_SERVER_ERROR';
  const message = isPayloadTooLarge
    ? 'Request body exceeds the allowed size'
    : isAppError
      ? error.message
      : 'Internal server error';
  const details = isAppError && Array.isArray(error.details) ? error.details : [];

  response.status(statusCode).json({
    error: {
      code,
      message,
      details,
      requestId: request.requestId ?? null,
    },
  });
};

export default errorHandler;