const { createLogger, format, transports } = require('winston');
const config = require('../config');

// Configure logger
const logger = createLogger({
  level: config.logging.level,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    // Add file transport for production
    ...(config.environment === 'production' 
      ? [new transports.File({ filename: 'error.log', level: 'error' })] 
      : [])
  ]
});

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Set defaults
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
    isOperational: err.isOperational || false
  });
  
  // Response structure
  const errorResponse = {
    success: false,
    status: statusCode,
    message,
    ...(config.environment === 'development' && { stack: err.stack })
  };
  
  return res.status(statusCode).json(errorResponse);
};

module.exports = {
  ApiError,
  errorHandler,
  logger
};