'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 7002,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  DB_NAME: process.env.DB_NAME || 'reimbursements_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE, 10) || 604800000,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
