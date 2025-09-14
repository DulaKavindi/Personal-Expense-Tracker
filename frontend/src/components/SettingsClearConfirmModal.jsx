import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SettingsClearConfirmModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Data Deletion
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you absolutely sure you want to delete all expense data? This action cannot be undone and all your expenses will be permanently lost.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Consider exporting your data first as a backup before proceeding.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Yes, Delete All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsClearConfirmModal;
