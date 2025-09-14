import React from 'react';
import { Database, Download, Upload, RotateCcw, AlertTriangle, Trash2, Info } from 'lucide-react';

const exportData = () => {
    window.open("http://localhost:5000/api/expenses/export/json", "_blank");
};

const SettingsDataManagement = ({
  expenses,
  formatAmount,
  getDataSize,
  exportData,
  onRefresh,
  setShowClearConfirm
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
      <Database className="h-5 w-5 mr-2" />
      Data Management
    </h3>
    {/* Data Statistics */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <p className="text-sm text-blue-600">Total Expenses</p>
            <p className="font-semibold text-blue-900">{expenses.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-green-600 mr-2" />
          <div>
            <p className="text-sm text-green-600">Total Amount</p>
            <p className="font-semibold text-green-900">{formatAmount(expenses.reduce((sum, exp) => sum + exp.amount, 0))}</p>
          </div>
        </div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-purple-600 mr-2" />
          <div>
            <p className="text-sm text-purple-600">Data Size</p>
            <p className="font-semibold text-purple-900">{getDataSize()}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-4">

      {/* Export Data */}
     <div>
      <button
        onClick={exportData}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors cursor-pointer"
      >
        <Download className="h-5 w-5 mr-2" />
        Export Data (CSV)
      </button>
    </div>

      
      {/* Refresh Data */}
      <div>
        <button
          onClick={onRefresh}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Refresh Data
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Reload all data from the server to ensure you have the latest information.
        </p>
      </div>
      {/* Clear All Data */}
      <div className="border-t border-gray-200 pt-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-900">Danger Zone</h4>
          </div>
          <p className="text-sm text-red-700 mb-4">
            This action will permanently delete all your expense data. This cannot be undone.
          </p>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsDataManagement;
