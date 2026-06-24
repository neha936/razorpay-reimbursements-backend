'use strict';

const db = require('../config/db');
const AppError = require('../utils/AppError');

/**
 * Assign an EMP to an RM (create employee_managers record).
 */
const assignEmployee = async ({ employeeId, managerId }) => {
  // Validate employee exists and has role EMP
  const empResult = await db.query('SELECT id, role FROM users WHERE id = $1', [employeeId]);
  if (empResult.rows.length === 0) {
    throw new AppError('Employee not found.', 404);
  }
  if (empResult.rows[0].role !== 'EMP') {
    throw new AppError('The specified user is not an EMP.', 400);
  }

  // Validate manager exists and has role RM
  const rmResult = await db.query('SELECT id, role FROM users WHERE id = $1', [managerId]);
  if (rmResult.rows.length === 0) {
    throw new AppError('Manager not found.', 404);
  }
  if (rmResult.rows[0].role !== 'RM') {
    throw new AppError('The specified manager is not an RM.', 400);
  }

  const result = await db.query(
    `INSERT INTO employee_managers (employee_id, manager_id)
     VALUES ($1, $2)
     ON CONFLICT (employee_id, manager_id) DO NOTHING
     RETURNING *`,
    [employeeId, managerId]
  );

  if (result.rows.length === 0) {
    throw new AppError('This employee-manager assignment already exists.', 409);
  }

  return result.rows[0];
};

/**
 * Remove an EMP from an RM.
 */
const removeEmployee = async ({ employeeId, managerId }) => {
  const result = await db.query(
    `DELETE FROM employee_managers
     WHERE employee_id = $1 AND manager_id = $2
     RETURNING *`,
    [employeeId, managerId]
  );

  if (result.rows.length === 0) {
    throw new AppError('No such assignment found.', 404);
  }

  return { message: 'Assignment removed successfully.' };
};

/**
 * List employees based on the requesting user's role.
 *
 * EMP   → forbidden (enforced at route level)
 * RM    → only subordinates (employee_managers)
 * APE   → all EMPs and RMs
 * CFO   → all users
 */
const listEmployees = async (requestingUser) => {
  const { id, role } = requestingUser;

  if (role === 'RM') {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at
       FROM users u
       INNER JOIN employee_managers em ON em.employee_id = u.id
       WHERE em.manager_id = $1
       ORDER BY u.name`,
      [id]
    );
    return result.rows;
  }

  if (role === 'APE') {
    const result = await db.query(
      `SELECT id, name, email, role, created_at FROM users
       WHERE role IN ('EMP', 'RM')
       ORDER BY role, name`
    );
    return result.rows;
  }

  if (role === 'CFO') {
    const result = await db.query(
      `SELECT id, name, email, role, created_at FROM users
       ORDER BY role, name`
    );
    return result.rows;
  }

  throw new AppError('Forbidden.', 403);
};

module.exports = { assignEmployee, removeEmployee, listEmployees };
