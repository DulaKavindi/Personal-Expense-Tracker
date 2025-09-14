import React from 'react';
import { Settings } from 'lucide-react';

const SettingsAppConfig = ({ settings, handleSettingChange }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
      <Settings className="h-5 w-5 mr-2" />
      Application Settings
    </h3>
    <div className="space-y-6">
      {/* Currency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
        <select
          value={settings.currency}
          onChange={e => handleSettingChange('currency', e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
        <select
          value={settings.dateFormat}
          onChange={e => handleSettingChange('dateFormat', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
      {/* Default Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default Category for New Expenses</label>
        <select
          value={settings.defaultCategory}
          onChange={e => handleSettingChange('defaultCategory', e.target.value)}
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
            onChange={e => handleSettingChange('notifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Enable notifications</span>
        </label>
      </div>
    </div>
  </div>
);

export default SettingsAppConfig;
