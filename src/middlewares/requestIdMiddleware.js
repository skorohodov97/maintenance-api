import { randomUUID } from 'node:crypto';

const requestIdMiddleware = (request, response, next) => {
  request.requestId = randomUUID();
  response.set('X-Request-Id', request.requestId);

  next();
};

export default requestIdMiddleware;