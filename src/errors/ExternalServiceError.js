import AppError from './AppError.js';

class ExternalServiceError extends AppError {
  constructor(message = 'Weather service is unavailable') {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}

export default ExternalServiceError;