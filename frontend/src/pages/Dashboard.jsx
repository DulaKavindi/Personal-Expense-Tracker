import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import Summary from '../components/Summary';

const Dashboard = ({ 
  expenses, 
  summary, 
  loading, 
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onShowNotification 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddExpense = async (expenseData) => {
    const result = await onAddExpense(expenseData);
    if (result.success) {
      setShowAddForm(false);
      onShowNotification(result.message, 'success');
    } else {
      onShowNotification(result.message, 'error');
    }
  };

  // Get recent expenses (last 5)
  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  // Quick stats
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = useMemo(() => {
    return expenses.filter(exp => exp.date.startsWith(thisMonth));
  }, [expenses, thisMonth]);
  
  const thisMonthTotal = useMemo(() => {
    return thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [thisMonthExpenses]);

  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString().slice(0, 7);
  const lastMonthExpenses = useMemo(() => {
    return expenses.filter(exp => exp.date.startsWith(lastMonth));
  }, [expenses, lastMonth]);
  
  const lastMonthTotal = useMemo(() => {
    return lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [lastMonthExpenses]);

  const monthlyChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : 0;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Expense
        </button>
        
        <div className="flex items-center text-sm text-gray-600 bg-white px-4 py-3 rounded-lg shadow-md">
          <Calendar className="h-4 w-4 mr-2" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* This Month */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">This Month</p>
              <p className="text-2xl font-bold">{formatAmount(thisMonthTotal)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
          <div className="flex items-center mt-4">
            {monthlyChange >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              {Math.abs(monthlyChange)}% from last month
            </span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-200" />
          </div>
          <p className="text-green-100 text-sm mt-4">
            {thisMonthExpenses.length} this month
          </p>
        </div>

        {/* Average Expense */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Average Expense</p>
              <p className="text-2xl font-bold">{formatAmount(summary.averageExpense)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mt-4">
            Per transaction
          </p>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Categories</p>
              <p className="text-2xl font-bold">
                {summary.categoryTotals ? Object.keys(summary.categoryTotals).length : 0}
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">
                {summary.categoryTotals ? Object.keys(summary.categoryTotals).length : 0}
              </span>
            </div>
          </div>
          <p className="text-orange-100 text-sm mt-4">
            Different categories used
          </p>
        </div>
      </div>

      {/* Summary Component */}
      <Summary summary={summary} />

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
        </div>
        <div className="p-6">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No expenses found</p>
              <p className="text-sm text-gray-400 mt-1">
                Add your first expense using the button above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{expense.title}</h4>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatAmount(expense.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <ExpenseForm
              onSubmit={handleAddExpense}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;