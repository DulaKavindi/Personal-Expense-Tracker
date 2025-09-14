
const pool = require('../db');

const ExpenseModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    return result.rows;
  },
  async getById(id) {
    const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    return result.rows[0];
  },
  async create({ title, amount, category, date }) {
    const result = await pool.query(
      'INSERT INTO expenses (title, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, amount, category, date]
    );
    return result.rows[0];
  },
  async update(id, { title, amount, category, date }) {
    const result = await pool.query(
      'UPDATE expenses SET title = $1, amount = $2, category = $3, date = $4 WHERE id = $5 RETURNING *',
      [title, amount, category, date, id]
    );
    return result.rows[0];
  },
  async delete(id) {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
  async getSummary() {
    const totalResult = await pool.query('SELECT SUM(amount) AS total, COUNT(*) AS count FROM expenses');
    const categoryResult = await pool.query('SELECT category, SUM(amount) AS total FROM expenses GROUP BY category');
    const monthlyResult = await pool.query("SELECT to_char(date, 'YYYY-MM') AS month, SUM(amount) AS total FROM expenses GROUP BY month");
    return {
      total: Number(totalResult.rows[0].total) || 0,
      count: Number(totalResult.rows[0].count) || 0,
      categoryTotals: Object.fromEntries(categoryResult.rows.map(row => [row.category, Number(row.total)])),
      monthlyTotals: Object.fromEntries(monthlyResult.rows.map(row => [row.month, Number(row.total)])),
      averageExpense: totalResult.rows[0].count > 0 ? Number(totalResult.rows[0].total) / Number(totalResult.rows[0].count) : 0
    };
  }
};

module.exports = ExpenseModel;
