const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'expense_tracker', 
  password: 'dula123', 
  port: 5432,
});

module.exports = pool;
