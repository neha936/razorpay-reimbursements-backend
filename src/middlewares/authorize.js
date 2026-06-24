'use strict';

const AppError = require('../utils/AppError');

/**
 * Authorization middleware factory.
 * Returns a middleware that restricts access to the given role(s).
 *
 * @param {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post('/assign', authenticate, authorize('CFO'), controller.assignRole);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
          403
        )
      );
    }

    next();
  };
};

module.exports = authorize;
