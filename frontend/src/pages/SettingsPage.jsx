import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Save,
  AlertTriangle,
  Info,
  RotateCcw,
  Database
} from 'lucide-react';

const SettingsPage = ({ expenses, onRefresh }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [notification, setNotification] = useState('');
  const [settings, setSettings] = useState({
    currency: 'LKR',
    dateFormat: 'DD/MM/YYYY',
    defaultCategory: 'Other',
    notifications: true,
    darkMode: false
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(''), 3000);
  };

  // Export data as JSON
  const exportData = () => {
    const dataToExport = {
      expenses,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `expenses_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Data exported successfully!');
  };

  // Import data from JSON file
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.expenses && Array.isArray(importedData.expenses)) {
          // Here you would typically send this data to your backend
          console.log('Imported data:', importedData);
          showNotification(`Successfully imported ${importedData.expenses.length} expenses!`);
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        showNotification('Error importing file. Please check the file format.', 'error');
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      // In a real app, you would make API calls to delete all expenses
      console.log('Clearing all data...');
      showNotification('All data cleared successfully!');
      setShowClearConfirm(false);
      onRefresh();
    } catch (error) {
      showNotification('Error clearing data', 'error');
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    showNotification('Settings updated');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getDataSize = () => {
    const dataStr = JSON.stringify(expenses);
    const sizeInBytes = new Blob([dataStr]).size;
    return (sizeInBytes / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Application Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Application Settings
        </h3>
        
        <div className="space-y-6">
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LKR">Sri Lankan Rupee (LKR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Default Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Category for New Expenses
            </label>
            <select
              value={settings.defaultCategory}
              onChange={(e) => handleSettingChange('defaultCategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notifications */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Enable notifications</span>
            </label>
          </div>

          {/* Dark Mode */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Dark mode (Coming soon)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
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
                <p className="font-semibold text-green-900">
                  {formatAmount(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
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
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Data (JSON)
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Download all your expense data as a JSON file for backup or transfer.
            </p>
          </div>

          {/* Import Data */}
          <div>
            <label className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors cursor-pointer">
              <Upload className="h-5 w-5 mr-2" />
              Import Data (JSON)
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-600 mt-2">
              Upload a previously exported JSON file to restore your data.
            </p>
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

      {/* About */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          About Expense Tracker
        </h3>
        
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <strong className="text-gray-900">Version:</strong> 1.0.0
          </div>
          <div>
            <strong className="text-gray-900">Built with:</strong> React, Node.js, Express, Tailwind CSS
          </div>
          <div>
            <strong className="text-gray-900">Features:</strong>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>Add, edit, and delete expenses</li>
              <li>Category-based organization</li>
              <li>Advanced filtering and search</li>
              <li>Statistical analysis and trends</li>
              <li>Data export and import</li>
              <li>Responsive design</li>
            </ul>
          </div>
          <div>
            <strong className="text-gray-900">Support:</strong> 
            <p className="mt-1">
              If you encounter any issues or have suggestions, please check the console for error messages 
              and ensure your backend server is running properly.
            </p>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Data Deletion
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to delete all expense data? 
              This action cannot be undone and all your expenses will be permanently lost.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Tip:</strong> Consider exporting your data first as a backup before proceeding.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Connection Status</h4>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            Backend server: Connected (http://localhost:5000)
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Make sure your backend server is running for full functionality.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;