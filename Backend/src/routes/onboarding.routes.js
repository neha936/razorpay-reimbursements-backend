'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/onboarding.controller');
const validate = require('../middlewares/validate');

/**
 * POST /rest/onboardings/register
 * Public route — register a new EMP account.
 */
router.post(
  '/register',
  validate(['name', 'email', 'password']),
  controller.register
);

/**
 * POST /rest/onboardings/login
 * Public route — login and receive auth cookie.
 */
router.post(
  '/login',
  validate(['email', 'password']),
  controller.login
);

/**
 * POST /rest/onboardings/logout
 * Public route — clear auth cookie.
 */
router.post('/logout', controller.logout);

module.exports = router;
