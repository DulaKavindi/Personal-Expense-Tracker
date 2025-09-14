import React from 'react';

const SettingsAbout = () => (
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
);

export default SettingsAbout;
