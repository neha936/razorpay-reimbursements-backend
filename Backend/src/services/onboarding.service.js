'use strict';

const db = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const ORG_DOMAIN = '@org.com';

/**
 * Register a new employee.
 * Only @org.com emails are allowed. Role is forced to EMP.
 */
const register = async ({ name, email, password }) => {
  // Validate org domain
  if (!email.toLowerCase().endsWith(ORG_DOMAIN)) {
    throw new AppError(`Only ${ORG_DOMAIN} email addresses are allowed.`, 400);
  }

  // Check duplicate
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'EMP')
     RETURNING id, name, email, role, created_at`,
    [name.trim(), email.toLowerCase(), hashedPassword]
  );

  return result.rows[0];
};

/**
 * Authenticate a user and return a signed JWT.
 */
const login = async ({ email, password }) => {
  const result = await db.query(
    'SELECT id, name, email, password, role FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  const user = result.rows[0];
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = { register, login };
