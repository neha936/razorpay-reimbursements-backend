'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Sign a JWT with the given payload.
 * @param {object} payload - Data to embed in the token
 * @returns {string} Signed JWT string
 */
const signToken = (payload) => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

/**
 * Verify a JWT and return its decoded payload.
 * @param {string} token - JWT string to verify
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token) => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = { signToken, verifyToken };
