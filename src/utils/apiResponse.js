'use strict';

/**
 * Send a standardised success response.
 * @param {object} res        - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message    - Human-readable success message
 * @param {*}      data       - Payload to include in the response
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

/**
 * Send a standardised error response.
 * @param {object} res        - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message    - Error message
 * @param {*}      errors     - Optional validation / field errors
 */
const sendError = (res, statusCode, message, errors = null) => {
  const body = { success: false, message };
  if (errors !== null) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };
