import React from 'react';

const DarkModeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded transition ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
      onClick={onToggle}
      aria-label="Toggle dark mode"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
