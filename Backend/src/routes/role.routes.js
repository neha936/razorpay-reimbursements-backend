'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/role.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');

/**
 * POST /rest/roles/assign
 * Only CFO can assign roles to users.
 */
router.post(
  '/assign',
  authenticate,
  authorize('CFO'),
  validate(['userId', 'role']),
  controller.assignRole
);

module.exports = router;
