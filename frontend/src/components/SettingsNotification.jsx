import React from 'react';

const SettingsNotification = ({ notification }) => {
  if (!notification) return null;
  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
      notification.type === 'success'
        ? 'bg-green-50 text-green-800 border border-green-200'
        : 'bg-red-50 text-red-800 border border-red-200'
    }`}>
      {notification.message}
    </div>
  );
};

export default SettingsNotification;
