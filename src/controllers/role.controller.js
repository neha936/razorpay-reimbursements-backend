'use strict';

const roleService = require('../services/role.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /rest/roles/assign
 * Only CFO can call this route.
 */
const assignRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const updated = await roleService.assignRole({ userId: parseInt(userId, 10), role });
    sendSuccess(res, 200, `Role updated to ${updated.role} for user ${updated.email}.`, updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { assignRole };
