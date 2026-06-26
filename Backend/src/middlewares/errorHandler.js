'use strict';

const AppError = require('../utils/AppError');
const { sendError } = require('../utils/apiResponse');
const env = require('../config/env');

/**
 * Global error handling middleware.
 * Catches all errors passed via next(err) and sends a structured JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Operational errors: known, safe to expose
  if (err.isOperational) {
    return sendError(res, err.statusCode, err.message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token has expired. Please log in again.');
  }

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return sendError(res, 409, 'A record with that value already exists.');
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return sendError(res, 400, 'Referenced record does not exist.');
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return sendError(res, 400, 'Data validation check failed.');
  }

  // Unknown / programming error – don't leak internals in production
  if (env.NODE_ENV !== 'development') {
    return sendError(res, 500, 'Something went wrong. Please try again later.');
  }

  console.error('[ERROR]', err);
  return sendError(res, err.statusCode || 500, err.message, {
    stack: err.stack,
  });
};

module.exports = errorHandler;
