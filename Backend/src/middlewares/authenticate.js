'use strict';

const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

/**
 * Authentication middleware.
 * Reads the JWT from the httpOnly cookie, verifies it, and attaches
 * the decoded user payload to req.user.
 */
const authenticate = (req, res, next) => {
  const token = req.cookies && req.cookies.auth_token;

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to continue.', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    next(err); // JsonWebTokenError or TokenExpiredError → errorHandler
  }
};

module.exports = authenticate;
