const ExpenseModel = require('../models/expenseModel');

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
    const { title, amount, category, date, description } = req.body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: 'Title, amount, category and date are required' });
    }
    try {
      const newExpense = await ExpenseModel.create({ title, amount, category, date, description });
      res.status(201).json({ success: true, data: newExpense, message: 'Expense created successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error creating expense' });
    }
  },
  async update(req, res) {
    const { title, amount, category, date, description } = req.body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: 'Title, amount, category and date are required' });
    }
    try {
      const updatedExpense = await ExpenseModel.update(req.params.id, { title, amount, category, date, description });
      if (!updatedExpense) return res.status(404).json({ success: false, message: 'Expense not found' });
      res.json({ success: true, data: updatedExpense, message: 'Expense updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error updating expense' });
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
  }
};

module.exports = ExpensesController;
