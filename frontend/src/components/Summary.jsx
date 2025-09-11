import React from 'react';
import { DollarSign, TrendingUp, Hash, BarChart3 } from 'lucide-react';

const Summary = ({ summary }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-green-500',
      'Transportation': 'bg-blue-500',
      'Entertainment': 'bg-purple-500',
      'Healthcare': 'bg-red-500',
      'Shopping': 'bg-pink-500',
      'Bills': 'bg-yellow-500',
      'Education': 'bg-indigo-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="mb-6"> 
      {/* Main Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"> 
        {/* Total Amount */}
  <div className="bg-white rounded-lg shadow-md p-6"> 
          <div className="flex items-center"> 
            <div className="p-2 bg-blue-100 rounded-md"> 
              <DollarSign className="h-6 w-6 text-blue-600" /> 
            </div>
            <div className="ml-4"> 
              <p className="text-sm font-medium text-gray-600">Total Expenses</p> 
              <p className="text-2xl font-bold text-gray-900"> 
                {formatAmount(summary.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Count */}
  <div className="bg-white rounded-lg shadow-md p-6"> 
          <div className="flex items-center"> 
            <div className="p-2 bg-green-100 rounded-md"> 
              <Hash className="h-6 w-6 text-green-600" /> 
            </div>
            <div className="ml-4"> 
              <p className="text-sm font-medium text-gray-600">Total Transactions</p> 
              <p className="text-2xl font-bold text-gray-900"> 
                {summary.count || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Average Expense */}
  <div className="bg-white rounded-lg shadow-md p-6"> 
          <div className="flex items-center"> 
            <div className="p-2 bg-purple-100 rounded-md"> 
              <TrendingUp className="h-6 w-6 text-purple-600" /> 
            </div>
            <div className="ml-4"> 
              <p className="text-sm font-medium text-gray-600">Average per Transaction</p> 
              <p className="text-2xl font-bold text-gray-900"> 
                {formatAmount(summary.averageExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Count */}
  <div className="bg-white rounded-lg shadow-md p-6"> 
          <div className="flex items-center"> 
            <div className="p-2 bg-orange-100 rounded-md"> 
              <BarChart3 className="h-6 w-6 text-orange-600" /> 
            </div>
            <div className="ml-4"> 
              <p className="text-sm font-medium text-gray-600">Categories Used</p> 
              <p className="text-2xl font-bold text-gray-900"> 
                {summary.categoryTotals ? Object.keys(summary.categoryTotals).length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {summary.categoryTotals && Object.keys(summary.categoryTotals).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6"> 
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center"> 
            <BarChart3 className="h-5 w-5 mr-2" /> 
            Expenses by Category
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
            {Object.entries(summary.categoryTotals)
              .sort(([,a], [,b]) => b - a) // Sort by amount descending
              .map(([category, amount]) => {
                const percentage = ((amount / summary.total) * 100).toFixed(1);
                return (
                  <div key={category} className="flex items-center p-3 bg-gray-50 rounded-md"> 
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} mr-3`}></div> 
                    <div className="flex-1"> 
                      <div className="flex justify-between items-center mb-1"> 
                        <span className="text-sm font-medium text-gray-700">{category}</span> 
                        <span className="text-xs text-gray-500">{percentage}%</span> 
                      </div>
                      <div className="text-sm font-semibold text-gray-900"> 
                        {formatAmount(amount)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"> 
                        <div 
                          className={`h-1.5 rounded-full ${getCategoryColor(category)}`}
                          style={{width: `${percentage}%`}}
                        ></div> 
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;