'use strict';

const db = require('../config/db');
const AppError = require('../utils/AppError');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recalculate and persist final_status based on per-role statuses.
 *
 * Rules:
 *  - Any REJECTED status (RM, APE, or CFO) → final_status = REJECTED
 *  - rm_status = APPROVED AND ape_status = APPROVED → final_status = APPROVED
 *  - Otherwise → final_status = PENDING
 */
const recalculateFinalStatus = async (client, reimbursementId) => {
  const { rows } = await client.query(
    'SELECT rm_status, ape_status, cfo_status FROM reimbursements WHERE id = $1',
    [reimbursementId]
  );
  const { rm_status, ape_status, cfo_status } = rows[0];

  let finalStatus = 'PENDING';

  if (
    rm_status === 'REJECTED' ||
    ape_status === 'REJECTED' ||
    cfo_status === 'REJECTED'
  ) {
    finalStatus = 'REJECTED';
  } else if (rm_status === 'APPROVED' && ape_status === 'APPROVED') {
    finalStatus = 'APPROVED';
  }

  await client.query(
    'UPDATE reimbursements SET final_status = $1, updated_at = NOW() WHERE id = $2',
    [finalStatus, reimbursementId]
  );

  return finalStatus;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Create a new reimbursement (EMP only).
 */
const createReimbursement = async (employeeId, { title, description, amount }) => {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new AppError('Amount must be a positive number.', 400);
  }

  const result = await db.query(
    `INSERT INTO reimbursements (employee_id, title, description, amount)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [employeeId, title.trim(), description ? description.trim() : null, parsedAmount]
  );

  return result.rows[0];
};

/**
 * Approve or reject a reimbursement based on the acting user's role.
 *
 * @param {object} actingUser   - { id, role } from JWT
 * @param {number} reimbId      - Reimbursement ID from request body
 * @param {string} action       - 'APPROVED' | 'REJECTED'
 */
const processApproval = async (actingUser, reimbId, action) => {
  const { id: actorId, role } = actingUser;

  if (!['APPROVED', 'REJECTED'].includes(action)) {
    throw new AppError("Action must be 'APPROVED' or 'REJECTED'.", 400);
  }

  // Fetch reimbursement
  const { rows } = await db.query(
    'SELECT * FROM reimbursements WHERE id = $1',
    [reimbId]
  );
  if (rows.length === 0) {
    throw new AppError('Reimbursement not found.', 404);
  }

  const reimb = rows[0];

  // Role-specific validation and column to update
  let column;

  if (role === 'RM') {
    // RM must be the direct manager of the employee
    const managerCheck = await db.query(
      'SELECT id FROM employee_managers WHERE employee_id = $1 AND manager_id = $2',
      [reimb.employee_id, actorId]
    );
    if (managerCheck.rows.length === 0) {
      throw new AppError('You are not the manager of this employee.', 403);
    }
    if (reimb.rm_status !== 'PENDING') {
      throw new AppError('This reimbursement has already been actioned at RM level.', 400);
    }
    column = 'rm_status';
  } else if (role === 'APE') {
    if (reimb.rm_status !== 'APPROVED') {
      throw new AppError('Reimbursement must be approved by RM before APE can act.', 400);
    }
    if (reimb.ape_status !== 'PENDING') {
      throw new AppError('This reimbursement has already been actioned at APE level.', 400);
    }
    column = 'ape_status';
  } else if (role === 'CFO') {
    if (reimb.ape_status !== 'APPROVED') {
      throw new AppError('Reimbursement must be approved by APE before CFO can act.', 400);
    }
    if (reimb.cfo_status !== 'PENDING') {
      throw new AppError('This reimbursement has already been actioned at CFO level.', 400);
    }
    column = 'cfo_status';
  } else {
    throw new AppError('You are not authorised to approve reimbursements.', 403);
  }

  // Use a transaction so status column update + final_status recalc are atomic
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE reimbursements SET ${column} = $1, updated_at = NOW() WHERE id = $2`,
      [action, reimbId]
    );

    const finalStatus = await recalculateFinalStatus(client, reimbId);

    await client.query('COMMIT');

    const updated = await db.query('SELECT * FROM reimbursements WHERE id = $1', [reimbId]);
    return updated.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * List reimbursements based on the requesting user's role.
 *
 * EMP  → own reimbursements
 * RM   → subordinates' reimbursements where rm_status = PENDING
 * APE  → reimbursements where rm_status = APPROVED AND ape_status = PENDING
 * CFO  → reimbursements where ape_status = APPROVED
 */
const listReimbursements = async (requestingUser) => {
  const { id, role } = requestingUser;

  if (role === 'EMP') {
    const { rows } = await db.query(
      `SELECT r.*, u.name AS employee_name, u.email AS employee_email
       FROM reimbursements r
       INNER JOIN users u ON u.id = r.employee_id
       WHERE r.employee_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );
    return rows;
  }

  if (role === 'RM') {
    const { rows } = await db.query(
      `SELECT r.*, u.name AS employee_name, u.email AS employee_email
       FROM reimbursements r
       INNER JOIN users u ON u.id = r.employee_id
       INNER JOIN employee_managers em ON em.employee_id = r.employee_id
       WHERE em.manager_id = $1 AND r.rm_status = 'PENDING'
       ORDER BY r.created_at DESC`,
      [id]
    );
    return rows;
  }

  if (role === 'APE') {
    const { rows } = await db.query(
      `SELECT r.*, u.name AS employee_name, u.email AS employee_email
       FROM reimbursements r
       INNER JOIN users u ON u.id = r.employee_id
       WHERE r.rm_status = 'APPROVED' AND r.ape_status = 'PENDING'
       ORDER BY r.created_at DESC`
    );
    return rows;
  }

  if (role === 'CFO') {
    const { rows } = await db.query(
      `SELECT r.*, u.name AS employee_name, u.email AS employee_email
       FROM reimbursements r
       INNER JOIN users u ON u.id = r.employee_id
       WHERE r.ape_status = 'APPROVED'
       ORDER BY r.created_at DESC`
    );
    return rows;
  }

  throw new AppError('Forbidden.', 403);
};

/**
 * Get all reimbursements for a specific employee.
 * Only accessible by the employee's direct RM manager.
 *
 * @param {object} requestingUser - { id, role } from JWT (must be RM)
 * @param {number} userId         - Target employee's ID
 */
const getSubordinateReimbursements = async (requestingUser, userId) => {
  const { id: managerId, role } = requestingUser;

  if (role !== 'RM') {
    throw new AppError('Only an RM can access subordinate reimbursements.', 403);
  }

  // Verify the requested user is a subordinate of this RM
  const check = await db.query(
    'SELECT id FROM employee_managers WHERE employee_id = $1 AND manager_id = $2',
    [userId, managerId]
  );
  if (check.rows.length === 0) {
    throw new AppError('The requested user is not your subordinate.', 403);
  }

  const { rows } = await db.query(
    `SELECT r.*, u.name AS employee_name, u.email AS employee_email
     FROM reimbursements r
     INNER JOIN users u ON u.id = r.employee_id
     WHERE r.employee_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );

  return rows;
};

module.exports = {
  createReimbursement,
  processApproval,
  listReimbursements,
  getSubordinateReimbursements,
};
