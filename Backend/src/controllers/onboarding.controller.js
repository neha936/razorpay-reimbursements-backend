'use strict';

const onboardingService = require('../services/onboarding.service');
const { sendSuccess } = require('../utils/apiResponse');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: env.COOKIE_MAX_AGE,
};

/**
 * POST /rest/onboardings/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await onboardingService.register({ name, email, password });
    sendSuccess(res, 201, 'Registration successful.', user);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /rest/onboardings/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await onboardingService.login({ email, password });

    res.cookie('auth_token', token, cookieOptions);

    sendSuccess(res, 200, 'Login successful.', user);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /rest/onboardings/logout
 */
const logout = (req, res, next) => {
  try {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    sendSuccess(res, 200, 'Logged out successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout };