import { AppError } from '../errors/index.js';

const errorHandler = (error, request, response, next) => {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const code = isAppError ? error.code : 'INTERNAL_SERVER_ERROR';
  const message = isAppError ? error.message : 'Internal server error';
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
