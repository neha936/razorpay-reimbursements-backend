'use strict';

const employeeService = require('../services/employee.service');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /rest/employees/assign
 * Assign an EMP to an RM.
 */
const assignEmployee = async (req, res, next) => {
  try {
    const { employeeId, managerId } = req.body;
    const result = await employeeService.assignEmployee({
      employeeId: parseInt(employeeId, 10),
      managerId: parseInt(managerId, 10),
    });
    sendSuccess(res, 201, 'Employee assigned to manager successfully.', result);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /rest/employees/assign
 * Remove an EMP from an RM.
 */
const removeEmployee = async (req, res, next) => {
  try {
    const { employeeId, managerId } = req.body;
    const result = await employeeService.removeEmployee({
      employeeId: parseInt(employeeId, 10),
      managerId: parseInt(managerId, 10),
    });
    sendSuccess(res, 200, result.message);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /rest/employees
 * List employees based on the requesting user's role.
 */
const listEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.listEmployees(req.user);
    sendSuccess(res, 200, 'Employees retrieved successfully.', employees);
  } catch (err) {
    next(err);
  }
};

module.exports = { assignEmployee, removeEmployee, listEmployees };
