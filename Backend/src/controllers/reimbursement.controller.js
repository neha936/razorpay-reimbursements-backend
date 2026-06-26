'use strict';

const reimbursementService = require('../services/reimbursement.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /rest/reimbursements
 * Create a new reimbursement (EMP only).
 */
const createReimbursement = async (req, res, next) => {
  try {
    const { title, description, amount } = req.body;
    const reimbursement = await reimbursementService.createReimbursement(
      req.user.id,
      { title, description, amount }
    );
    sendSuccess(res, 201, 'Reimbursement created successfully.', reimbursement);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /rest/reimbursements
 * Approve or reject a reimbursement (RM, APE, CFO).
 * Body: { reimbursementId, action: 'APPROVED' | 'REJECTED' }
 */
const processApproval = async (req, res, next) => {
  try {
    const { reimbursementId, action } = req.body;
    const updated = await reimbursementService.processApproval(
      req.user,
      parseInt(reimbursementId, 10),
      action
    );
    sendSuccess(res, 200, `Reimbursement ${action.toLowerCase()} successfully.`, updated);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /rest/reimbursements
 * List reimbursements based on the requesting user's role.
 */
const listReimbursements = async (req, res, next) => {
  try {
    const reimbursements = await reimbursementService.listReimbursements(req.user);
    sendSuccess(res, 200, 'Reimbursements retrieved successfully.', reimbursements);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /rest/reimbursements/:userId
 * Get reimbursements of a specific subordinate (RM only).
 */
const getSubordinateReimbursements = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const reimbursements = await reimbursementService.getSubordinateReimbursements(
      req.user,
      userId
    );
    sendSuccess(res, 200, 'Subordinate reimbursements retrieved successfully.', reimbursements);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReimbursement,
  processApproval,
  listReimbursements,
  getSubordinateReimbursements,
};
