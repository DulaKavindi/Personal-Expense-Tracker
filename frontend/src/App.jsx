import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import Notification from './components/Notification';

const API_URL = 'http://localhost:5000/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  // Notification functions
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}?category=${filters.category}`;
      if (filters.startDate && filters.endDate) {
        url += `&startDate=${filters.startDate}&endDate=${filters.endDate}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setExpenses(data.data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/summary/stats`);
      const data = await res.json();
      setSummary(data.data || {});
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  // Add expense
  const handleAddExpense = async (expenseData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });

      if (res.ok) {
        await fetchExpenses();
        await fetchSummary();
        showNotification('Expense added successfully!', 'success');
        return { success: true, message: 'Expense added successfully!' };
      } else {
        showNotification('Failed to add expense', 'error');
        return { success: false, message: 'Failed to add expense' };
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      showNotification('Error adding expense', 'error');
      return { success: false, message: 'Error adding expense' };
    }
  };

  // Update expense
  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });

      if (res.ok) {
        await fetchExpenses();
        await fetchSummary();
        showNotification('Expense updated successfully!', 'success');
        return { success: true, message: 'Expense updated successfully!' };
      } else {
        showNotification('Failed to update expense', 'error');
        return { success: false, message: 'Failed to update expense' };
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      showNotification('Error updating expense', 'error');
      return { success: false, message: 'Error updating expense' };
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      if (res.ok) {
        await fetchExpenses();
        await fetchSummary();
        showNotification('Expense deleted successfully!', 'success');
        return { success: true, message: 'Expense deleted successfully!' };
      } else {
        showNotification('Failed to delete expense', 'error');
        return { success: false, message: 'Failed to delete expense' };
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      showNotification('Error deleting expense', 'error');
      return { success: false, message: 'Error deleting expense' };
    }
  };

  // Filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchExpenses();
    fetchSummary();
  };

  return (
    <Router>
      <div className={darkMode ? "min-h-screen bg-gray-900 text-gray-100" : "min-h-screen bg-gray-50 text-gray-900"}>
        <Navbar />
        <div className="flex justify-end px-4 py-2">
          <button
            onClick={toggleDarkMode}
            className={darkMode ? "bg-gray-700 text-white px-4 py-2 rounded-md" : "bg-gray-200 text-gray-900 px-4 py-2 rounded-md"}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard
                  expenses={expenses}
                  summary={summary}
                  loading={loading}
                  onAddExpense={handleAddExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onShowNotification={showNotification}
                  darkMode={darkMode}
                />
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <ExpensesPage
                  expenses={expenses}
                  loading={loading}
                  filters={filters}
                  onAddExpense={handleAddExpense}
                  onUpdateExpense={handleUpdateExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onFilterChange={handleFilterChange}
                  onShowNotification={showNotification}
                  darkMode={darkMode}
                />
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <StatisticsPage
                  expenses={expenses}
                  summary={summary}
                  loading={loading}
                  darkMode={darkMode}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <SettingsPage
                  expenses={expenses}
                  onRefresh={handleRefresh}
                  darkMode={darkMode}
                />
              } 
            />
          </Routes>
        </main>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </Router>
  );
}

export default App;