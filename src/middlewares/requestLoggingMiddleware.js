import logger from '../utils/logger.js';

const requestLoggingMiddleware = (request, response, next) => {
  const startedAt = process.hrtime.bigint();

  response.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.info('Request completed', {
      method: request.method,
      path: request.originalUrl,
      status: response.statusCode,
      duration: Number(duration.toFixed(2)),
      requestId: request.requestId,
    });
  });

  next();
};

export default requestLoggingMiddleware;