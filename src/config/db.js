

'use strict';

const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});



console.log("DB_HOST =", env.DB_HOST);
console.log("DB_USER =", env.DB_USER);
console.log("DB_PASSWORD =", env.DB_PASSWORD);
console.log("DB_NAME =", env.DB_NAME);






pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

/**
 * Execute a single parameterised query.
 * @param {string} text  - SQL query string
 * @param {Array}  params - Query parameters
 */
const query = (text, params) => pool.query(text, params);

/**
 * Borrow a client from the pool (for transactions).
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
