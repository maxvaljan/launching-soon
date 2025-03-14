const { ApiError } = require('./errorHandler');

/**
 * Handler for 404 errors - routes not found
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

module.exports = {
  notFoundHandler
};