'use strict';

const AppError = require('../utils/AppError');

/**
 * Request body validation helper.
 * Checks that all required fields are present and non-empty in req.body.
 *
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post('/register', validate(['name', 'email', 'password']), controller.register);
 */
const validate = (requiredFields) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of requiredFields) {
      const value = req.body[field];
      if (value === undefined || value === null || String(value).trim() === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return next(
        new AppError(`Missing required field(s): ${missing.join(', ')}`, 400)
      );
    }

    next();
  };
};

module.exports = validate;
