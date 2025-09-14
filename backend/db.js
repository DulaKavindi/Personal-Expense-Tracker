const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Change to your PostgreSQL username
  host: 'localhost',
  database: 'expense_tracker', // Change to your database name
  password: 'dula123', // Change to your PostgreSQL password
  port: 5432,
});

module.exports = pool;
