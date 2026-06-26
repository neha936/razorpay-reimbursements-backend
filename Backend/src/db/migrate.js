'use strict';

require('dotenv').config();
const { pool } = require('../config/db');

const SQL = `
-- ENUMS (create only if they do not exist)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('EMP', 'RM', 'APE', 'CFO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE reimb_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE final_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- TABLE: users
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        user_role     NOT NULL DEFAULT 'EMP',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- TABLE: employee_managers
CREATE TABLE IF NOT EXISTS employee_managers (
  id           SERIAL PRIMARY KEY,
  employee_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  manager_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (employee_id, manager_id)
);

-- TABLE: reimbursements
CREATE TABLE IF NOT EXISTS reimbursements (
  id           SERIAL PRIMARY KEY,
  employee_id  INT            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255)   NOT NULL,
  description  TEXT,
  amount       NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  rm_status    reimb_status   NOT NULL DEFAULT 'PENDING',
  ape_status   reimb_status   NOT NULL DEFAULT 'PENDING',
  cfo_status   reimb_status   NOT NULL DEFAULT 'PENDING',
  final_status final_status   NOT NULL DEFAULT 'PENDING',
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
`;

(async () => {
  console.log('Running migrations...');
  try {
    await pool.query(SQL);
    console.log('✅ Migrations completed successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
