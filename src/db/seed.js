'use strict';

require('dotenv').config();
const { pool } = require('../config/db');
const { hashPassword } = require('../utils/hash');

const CFO = {
  name: 'CFO Admin',
  email: 'cfo@org.com',
  password: 'CFO#ORG@April2026',
  role: 'CFO',
};

(async () => {
  console.log('Running seed...');
  try {
    const hashedPassword = await hashPassword(CFO.password);

    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [CFO.name, CFO.email, hashedPassword, CFO.role]
    );

    console.log('✅ Seed completed: CFO account ensured.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
