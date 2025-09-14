
const pool = require('../db');

const ExpenseModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    console.log("DB rows:", result.rows);
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
    const monthlyResult = await pool.query("SELECT to_char(date, 'YYYY-MM') AS month, SUM(amount) AS total, COUNT(*) AS count FROM expenses GROUP BY month");
    const monthlyTotals = Object.fromEntries(monthlyResult.rows.map(row => [row.month, Number(row.total)]));
    // Calculate average expense per month
    const monthlyAverages = Object.fromEntries(monthlyResult.rows.map(row => [row.month, row.count > 0 ? Number(row.total) / Number(row.count) : 0]));
    return {
      total: Number(totalResult.rows[0].total) || 0,
      count: Number(totalResult.rows[0].count) || 0,
      categoryTotals: Object.fromEntries(categoryResult.rows.map(row => [row.category, Number(row.total)])),
      monthlyTotals,
      averageExpense: totalResult.rows[0].count > 0 ? Number(totalResult.rows[0].total) / Number(totalResult.rows[0].count) : 0,
      monthlyAverages
    };
  },
  // Clear all expenses
  async clearAll() {
    await pool.query('DELETE FROM expenses');
  },
  // Import bulk expenses
  async importBulk(expenses) {
    if (!Array.isArray(expenses) || expenses.length === 0) return;
    const values = expenses.map(exp => [exp.title, exp.amount, exp.category, exp.date]);
    const query = `INSERT INTO expenses (title, amount, category, date) VALUES ${values.map((_, i) => `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`).join(', ')};`;
    const flatValues = values.flat();
    await pool.query(query, flatValues);
  }
};

module.exports = ExpenseModel;
