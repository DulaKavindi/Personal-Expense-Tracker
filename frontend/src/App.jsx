import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import FilterBar from './components/FilterBar';

const API_URL = 'http://localhost:5000/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: ''
  });
  const [summary, setSummary] = useState({
    total: 0,
    count: 0,
    categoryTotals: {},
    monthlyTotals: {},
    averageExpense: 0
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    let url = `${API_URL}?category=${filters.category}`;
    if (filters.startDate && filters.endDate) {
      url += `&startDate=${filters.startDate}&endDate=${filters.endDate}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setExpenses(data.date || []);
  };

  // Fetch summary
  const fetchSummary = async () => {
    const res = await fetch(`${API_URL}/summary/stats`);
    const data = await res.json();
    setSummary(data.data || {});
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  // Add or update expense
  const handleFormSubmit = async (idOrExpense, expenseData) => {
    if (editingExpense) {
      // Update
      await fetch(`${API_URL}/${idOrExpense}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
    } else {
      // Add
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idOrExpense)
      });
    }
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
    fetchSummary();
  };

  // Delete expense
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchExpenses();
    fetchSummary();
  };

  // Edit expense
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  // Add new expense
  const handleAdd = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  // Filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Personal Expense Tracker</h1>
      <Summary summary={summary} />
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Expense
        </button>
      </div>
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;