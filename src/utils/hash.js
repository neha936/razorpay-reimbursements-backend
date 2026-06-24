'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * @param {string} password - Plain-text password
 * @returns {Promise<string>} Bcrypt hash
 */
const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

/**
 * Compare a plain-text password against a hash.
 * @param {string} password - Plain-text password
 * @param {string} hash     - Stored bcrypt hash
 * @returns {Promise<boolean>}
 */
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = { hashPassword, comparePassword };
