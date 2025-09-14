import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  PieChart,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const StatisticsPage = ({ expenses, summary, loading }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Calculate monthly trends
  const monthlyData = useMemo(() => {
    const monthMap = {};
    
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // YYYY-MM
      if (!monthMap[month]) {
        monthMap[month] = { total: 0, count: 0 };
      }
      monthMap[month].total += expense.amount;
      monthMap[month].count += 1;
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-parseInt(selectedPeriod.replace('months', '')))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        total: data.total,
        count: data.count,
        average: data.total / data.count
      }));
  }, [expenses, selectedPeriod]);

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const stats = {};
    const filteredExpenses = selectedCategory === 'All' 
      ? expenses 
      : expenses.filter(exp => exp.category === selectedCategory);

    filteredExpenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = { total: 0, count: 0, expenses: [] };
      }
      stats[expense.category].total += expense.amount;
      stats[expense.category].count += 1;
      stats[expense.category].expenses.push(expense);
    });

    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        average: data.total / data.count,
        percentage: (data.total / filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, selectedCategory]);

  // Get top expenses
  const topExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [expenses]);

  // Calculate growth trends
  const growthTrend = useMemo(() => {
    if (monthlyData.length < 2) return null;
    
    const current = monthlyData[monthlyData.length - 1];
    const previous = monthlyData[monthlyData.length - 2];
    
    const change = current.total - previous.total;
    const percentChange = (change / previous.total) * 100;
    
    return {
      change,
      percentChange,
      isIncrease: change > 0
    };
  }, [monthlyData]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data Available
        </h3>
        <p className="text-gray-500">
          Add some expenses to see detailed statistics and trends.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Filter
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {Object.keys(summary.categoryTotals || {}).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spending */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Spending</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(summary.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Average */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Monthly Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(monthlyData.reduce((sum, month) => sum + month.total, 0) / monthlyData.length)}
              </p>
            </div>
          </div>
        </div>

        {/* Trend */}
        {growthTrend && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              {growthTrend.isIncrease ? (
                <ArrowUp className="h-8 w-8 text-red-600 mr-3" />
              ) : (
                <ArrowDown className="h-8 w-8 text-green-600 mr-3" />
              )}
              <div>
                <p className="text-sm text-gray-600">Monthly Change</p>
                <p className={`text-2xl font-bold ${
                  growthTrend.isIncrease ? 'text-red-600' : 'text-green-600'
                }`}>
                  {growthTrend.percentChange.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Categories Used */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categoryStats.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Monthly Spending Trend
        </h3>
        
        {monthlyData.length > 0 ? (
          <div className="space-y-4">
            {monthlyData.map((month, index) => {
              const maxAmount = Math.max(...monthlyData.map(m => m.total));
              const widthPercentage = (month.total / maxAmount) * 100;
              
              return (
                <div key={month.month} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-600">
                    {month.month}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-blue-500 h-8 rounded-full flex items-center justify-end px-3"
                        style={{ width: `${Math.max(widthPercentage, 10)}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {formatAmount(month.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-600">
                    {month.count} items
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Not enough data to show monthly trends
          </p>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Category Breakdown
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryStats.map((stat) => (
            <div key={stat.category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${getCategoryColor(stat.category)} mr-3`}></div>
                  <span className="font-medium text-gray-900">{stat.category}</span>
                </div>
                <span className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{formatAmount(stat.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Count:</span>
                  <span>{stat.count} expenses</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average:</span>
                  <span>{formatAmount(stat.average)}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getCategoryColor(stat.category)}`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Expenses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Top 10 Highest Expenses
        </h3>
        
        <div className="space-y-3">
          {topExpenses.map((expense, index) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.title}</p>
                  <p className="text-sm text-gray-500">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatAmount(expense.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;