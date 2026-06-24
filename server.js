'use strict';

require('dotenv').config();

const app = require('./src/app');
const env = require('./src/config/env');

const PORT = env.PORT || 7002;

const server = app.listen(PORT, () => {
  console.log(`✅ Reimbursements Management Tool running on port ${PORT}`);
  console.log(`   Environment : ${env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
