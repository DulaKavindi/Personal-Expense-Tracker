const ExpenseModel = require('../models/expenseModel');
const validateExpense = require('./validateExpense');

const ExpensesController = {
  async getAll(req, res) {
    try {
      const expenses = await ExpenseModel.getAll();
      res.json({ success: true, data: expenses });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching expenses' });
    }
  },
  async getById(req, res) {
    try {
      const expense = await ExpenseModel.getById(req.params.id);
      if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
      res.json({ success: true, data: expense });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching expense' });
    }
  },
  async create(req, res) {
    try {
      validateExpense(req.body);
      const newExpense = await ExpenseModel.create(req.body);
      res.status(201).json({ success: true, data: newExpense, message: 'Expense created successfully' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  async update(req, res) {
    try {
      validateExpense(req.body);
      const updatedExpense = await ExpenseModel.update(req.params.id, req.body);
      if (!updatedExpense) return res.status(404).json({ success: false, message: 'Expense not found' });
      res.json({ success: true, data: updatedExpense, message: 'Expense updated successfully' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
  async delete(req, res) {
    try {
      const deletedExpense = await ExpenseModel.delete(req.params.id);
      if (!deletedExpense) return res.status(404).json({ success: false, message: 'Expense not found' });
      res.json({ success: true, data: deletedExpense, message: 'Expense deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting expense' });
    }
  },
  async getSummary(req, res) {
    try {
      const summary = await ExpenseModel.getSummary();
      res.json({ success: true, data: summary });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching summary' });
    }
  },
  async clearAll(req, res) {
    try {
      await ExpenseModel.clearAll();
      res.json({ success: true, message: 'All expenses cleared' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error clearing expenses' });
    }
  },
  async importBulk(req, res) {
    try {
      const { expenses } = req.body;
      if (!Array.isArray(expenses)) {
        return res.status(400).json({ success: false, message: 'Invalid expenses data' });
      }
      await ExpenseModel.importBulk(expenses);
      res.json({ success: true, message: 'Expenses imported successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error importing expenses' });
    }
  },

 async exportCsv(req, res) {
    try {
      const expenses = await ExpenseModel.getAll(); // DB data

      if (!expenses || expenses.length === 0) {
        return res.status(404).json({ success: false, message: "No expenses to export" });
      }

      // Convert DB rows to CSV
      const fields = ["id", "title", "amount", "category", "date"];
      const parser = new Parser({ fields });
      const csv = parser.parse(expenses);

      // Set headers to force download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
      res.status(200).send(csv); // send CSV content

    } catch (err) {
      console.error("Error exporting CSV:", err);
      res.status(500).json({ success: false, message: "Error exporting CSV" });
    }
  },
};

module.exports = ExpensesController;
