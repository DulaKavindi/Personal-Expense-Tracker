import React, { useState } from 'react';
import { Filter, Calendar, Tag, RotateCcw } from 'lucide-react';

const FilterBar = ({ onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    'All',
    'Food',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Bills',
    'Education',
    'Other'
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...localFilters,
      [filterType]: value
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: 'All',
      startDate: '',
      endDate: ''
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Get preset date ranges
  const getDateRange = (range) => {
    const today = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'today':
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'week':
        startDate.setDate(today.getDate() - 7);
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        return {
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      default:
        return { startDate: '', endDate: '' };
    }
  };

  const applyDateRange = (range) => {
    const { startDate, endDate } = getDateRange(range);
    const newFilters = {
      ...localFilters,
      startDate,
      endDate
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-medium text-gray-800">Filter Expenses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Category
          </label>
          <select
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Quick Date Range Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 mr-2">Quick filters:</span>
        <button
          onClick={() => applyDateRange('today')}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => applyDateRange('week')}
          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
        >
          Last 7 days
        </button>
        <button
          onClick={() => applyDateRange('month')}
          className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors"
        >
          Last 30 days
        </button>
      </div>
    </div>
  );
};

export default FilterBar;