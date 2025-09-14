import React from 'react';

const SettingsConnectionStatus = () => (
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
);

export default SettingsConnectionStatus;
