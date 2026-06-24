'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/employee.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');

/**
 * POST /rest/employees/assign
 * Assign an EMP to an RM. Accessible by CFO and APE.
 */
router.post(
  '/assign',
  authenticate,
  authorize('CFO', 'APE'),
  validate(['employeeId', 'managerId']),
  controller.assignEmployee
);

/**
 * DELETE /rest/employees/assign
 * Remove an EMP from an RM. Accessible by CFO and APE.
 */
router.delete(
  '/assign',
  authenticate,
  authorize('CFO', 'APE'),
  validate(['employeeId', 'managerId']),
  controller.removeEmployee
);

/**
 * GET /rest/employees
 * List employees. EMP is forbidden; RM/APE/CFO see filtered results.
 */
router.get(
  '/',
  authenticate,
  authorize('RM', 'APE', 'CFO'),
  controller.listEmployees
);

module.exports = router;
