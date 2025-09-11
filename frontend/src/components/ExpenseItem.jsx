import React from 'react';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-green-100 text-green-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Bills': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {expense.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
              <Tag className="h-3 w-3 mr-1" />
              {expense.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(expense.date)}
            </div>
            {expense.description && (
              <div className="flex-1">
                <p className="truncate max-w-md">{expense.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Amount */}
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-900">
              {formatAmount(expense.amount)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(expense)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit expense"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              title="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;