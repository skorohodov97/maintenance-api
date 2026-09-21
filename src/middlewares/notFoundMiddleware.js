import { NotFoundError } from '../errors/index.js';

const notFoundMiddleware = (request, response, next) => {
  next(new NotFoundError(`Route ${request.method} ${request.originalUrl} not found`));
};

export default notFoundMiddleware;