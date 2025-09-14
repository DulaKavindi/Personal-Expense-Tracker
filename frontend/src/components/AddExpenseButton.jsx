import React from 'react';

const AddExpenseButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      onClick={onClick}
    >
      Add Expense
    </button>
  );
};

export default AddExpenseButton;
