'use strict';

const express = require('express');
const router = express.Router();

const onboardingRoutes     = require('./onboarding.routes');
const roleRoutes           = require('./role.routes');
const employeeRoutes       = require('./employee.routes');
const reimbursementRoutes  = require('./reimbursement.routes');

router.use('/onboardings',    onboardingRoutes);
router.use('/roles',          roleRoutes);
router.use('/employees',      employeeRoutes);
router.use('/reimbursements', reimbursementRoutes);

module.exports = router;
