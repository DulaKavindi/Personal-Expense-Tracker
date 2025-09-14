
import React, { useState } from 'react';
import SettingsNotification from '../components/SettingsNotification';
import SettingsAppConfig from '../components/SettingsAppConfig';
import SettingsDataManagement from '../components/SettingsDataManagement';
import SettingsAbout from '../components/SettingsAbout';
import SettingsClearConfirmModal from '../components/SettingsClearConfirmModal';
import SettingsConnectionStatus from '../components/SettingsConnectionStatus';


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

  // Export data as JSON (fetch from backend)
  const exportData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses');
      const data = await response.json();
      const dataToExport = {
        expenses: data.data || [],
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `expenses_backup_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showNotification('Data exported successfully!');
    } catch (error) {
      showNotification('Error exporting data', 'error');
    }
  };

  // Import data from JSON file (send to backend)
  const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.expenses && Array.isArray(importedData.expenses)) {
          // Send imported expenses to backend
          const response = await fetch('http://localhost:5000/api/expenses/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expenses: importedData.expenses })
          });
          if (response.ok) {
            showNotification(`Successfully imported ${importedData.expenses.length} expenses!`);
            onRefresh();
          } else {
            showNotification('Error importing data to backend', 'error');
          }
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        showNotification('Error importing file. Please check the file format.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Clear all data (delete from backend)
  const clearAllData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses/clear', {
        method: 'DELETE'
      });
      if (response.ok) {
        showNotification('All data cleared successfully!');
        setShowClearConfirm(false);
        onRefresh();
      } else {
        showNotification('Error clearing data', 'error');
      }
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
      <SettingsNotification notification={notification} />
      <SettingsAppConfig settings={settings} handleSettingChange={handleSettingChange} />
      <SettingsDataManagement
        expenses={expenses}
        formatAmount={formatAmount}
        getDataSize={getDataSize}
        exportData={exportData}
        importData={importData}
        onRefresh={onRefresh}
        setShowClearConfirm={setShowClearConfirm}
      />
      <SettingsAbout />
      <SettingsClearConfirmModal
        show={showClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={clearAllData}
      />
      <SettingsConnectionStatus />
    </div>
  );
};

export default SettingsPage;