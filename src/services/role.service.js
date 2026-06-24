'use strict';

const db = require('../config/db');
const AppError = require('../utils/AppError');

const VALID_ROLES = ['EMP', 'RM', 'APE', 'CFO'];

/**
 * Assign a new role to an existing user.
 * Only CFO can call this (enforced at route level).
 */
const assignRole = async ({ userId, role }) => {
  if (!VALID_ROLES.includes(role)) {
    throw new AppError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`, 400);
  }

  const userResult = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [userId]);
  if (userResult.rows.length === 0) {
    throw new AppError('User not found.', 404);
  }

  const result = await db.query(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2
     RETURNING id, name, email, role`,
    [role, userId]
  );

  return result.rows[0];
};

module.exports = { assignRole };
