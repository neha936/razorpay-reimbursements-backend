'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/reimbursement.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');

/**
 * POST /rest/reimbursements
 * Create a new reimbursement. EMP only.
 */
router.post(
  '/',
  authenticate,
  authorize('EMP'),
  validate(['title', 'amount']),
  controller.createReimbursement
);

/**
 * PATCH /rest/reimbursements
 * Approve or reject a reimbursement. RM, APE, CFO only.
 */
router.patch(
  '/',
  authenticate,
  authorize('RM', 'APE', 'CFO'),
  validate(['reimbursementId', 'action']),
  controller.processApproval
);

/**
 * GET /rest/reimbursements
 * List reimbursements (role-based filtering). All authenticated roles.
 */
router.get(
  '/',
  authenticate,
  controller.listReimbursements
);

/**
 * GET /rest/reimbursements/:userId
 * Get reimbursements of a specific subordinate employee. RM only.
 */
router.get(
  '/:userId',
  authenticate,
  authorize('RM'),
  controller.getSubordinateReimbursements
);

module.exports = router;
