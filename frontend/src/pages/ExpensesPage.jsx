import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FilterBar from '../components/FilterBar';

const ExpensesPage = ({ 
  expenses, 
  loading, 
  filters: globalFilters,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onFilterChange,
  onShowNotification 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Always show all expenses, ignore search/filter
  const filteredExpenses = expenses;

  const handleAddExpense = async (expenseData) => {
    const result = await onAddExpense(expenseData);
    if (result.success) {
      setShowAddForm(false);
      onShowNotification(result.message, 'success');
    } else {
      onShowNotification(result.message, 'error');
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    const result = await onUpdateExpense(id, expenseData);
    if (result.success) {
      setEditingExpense(null);
      setShowAddForm(false);
      onShowNotification(result.message, 'success');
    } else {
      onShowNotification(result.message, 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const result = await onDeleteExpense(id);
      if (result.success) {
        onShowNotification(result.message, 'success');
      } else {
        onShowNotification(result.message, 'error');
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  const handleFilterChange = (newFilters) => {
    onFilterChange(newFilters);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingExpense(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors border ${
              showFilters
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Summary Info */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Total: </span>
            <span className="text-gray-900 font-semibold">
              {formatAmount(getTotalAmount())}
            </span>
          </div>
          <div>
            <span className="font-medium">Count: </span>
            <span className="text-gray-900 font-semibold">
              {filteredExpenses.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search expenses by title, category, or description..."
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Clear search</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <span className="font-medium">Search Results:</span> Found {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} 
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Filter Bar */}
      {showFilters && (
        <FilterBar 
          onFilterChange={handleFilterChange} 
          filters={globalFilters}
        />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      ) : (
        /* Expense List */
        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      )}

      {/* Add/Edit Expense Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <ExpenseForm
              expense={editingExpense}
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
              onCancel={() => {
                setShowAddForm(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Empty State when no results */}
      {!loading && filteredExpenses.length === 0 && expenses.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No expenses found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? `No expenses match your search "${searchTerm}"`
              : "No expenses match your current filters"
            }
          </p>
          <div className="space-x-3">
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                onFilterChange({
                  category: 'All',
                  startDate: '',
                  endDate: ''
                });
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;