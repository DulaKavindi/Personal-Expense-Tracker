const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

//Middleware
app.use(cors());
app.use(express.json());

//In-memoer database (expense array)
let expenses = [
    {
    id: 1,
    title: 'Groceries',
    amount: 2500,
    category: 'Food',
    date: '2024-01-15',
    description: 'Weekly grocery shopping'
  },
  {
    id: 2,
    title: 'Fuel',
    amount: 3000,
    category: 'Transportation',
    date: '2024-01-14',
    description: 'Car fuel'
  }
];

let nextId = 3;

//Rotes

//GET all expenses
app.get('/api/expenses', (req, res)=>{
    const {category, startDate, endDate} = req.query;

    let filteredExpenses = [...expenses];

    //Filter by category
    if(category && category !== 'ALL') {
        filteredExpenses = filteredExpenses.filter(exp => exp.category === category)
    }

    //Filter by data range
    if(startDate && endDate) {
        filteredExpenses = filteredExpenses.filter(exp => {
            const expData = new Date(exp.date);
            return expDate >= new Date(startDate) && expData <= new Date(endDate);
        });

    }

    res.json({
        success: true,
        date: filteredExpenses,
        total : filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    });
});

//Get single expense
app.get('/api/expenses/:id', (req,res) => {
    const expense = expenses.find(exp => exp.id === parseInt (req.params.id));

    if (!expense){
        return res.status(404).json({
            success: false,
            message: 'Expense not founded'
        });
    }

    res.json({
        success: false,
        data: expense
    });
});

//POST new expense
app.post('/api/expenses', (req,res) => {
    const {title, amount, category, data, description}=req.body;

    //validation
    if (!title || !amount || !category || !date) {
        return res.status(400).json ({
            success: false,
            message: 'Title, amount, category and date are required'
        });
    }

    const newExpense = {
        id: nextId ++,
        title,
        amount: parseFloat(amount),
        category,
        date,
        description: description || ''
    };

    expenses.push(newExpense);

    res.status(201).json({
        success: true,
        date: newExpense,
        message: 'Expense created successfully'
    });
});

//PUT update expense
app.put('/api/expenses/:id', (req, res) => {
    const expenseIndex = expenses. findIndex(exp => exp.id === parseInt(req.params.id));

    if (expenseIndex=== -1) {
        return res.status(404).json({
            success: false,
            message: 'Expense not found'
        });
    }

const { title, amount, category, date, description } = req.body;
  
  // Validation
  if (!title || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: 'Title, amount, category, and date are required'
    });
  }
  
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    title,
    amount: parseFloat(amount),
    category,
    date,
    description: description || ''
  };
  
  res.json({
    success: true,
    data: expenses[expenseIndex],
    message: 'Expense updated successfully'
  });
});

// DELETE expense
app.delete('/api/expenses/:id', (req, res) => {
  const expenseIndex = expenses.findIndex(exp => exp.id === parseInt(req.params.id));
  
  if (expenseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found'
    });
  }
  
  const deletedExpense = expenses.splice(expenseIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedExpense,
    message: 'Expense deleted successfully'
  });
});

// GET expense summary
app.get('/api/expenses/summary/stats', (req, res) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Category wise totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  // Monthly totals
  const monthlyTotals = expenses.reduce((acc, exp) => {
    const month = exp.date.substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + exp.amount;
    return acc;
  }, {});
  
  res.json({
    success: true,
    data: {
      total,
      count: expenses.length,
      categoryTotals,
      monthlyTotals,
      averageExpense: expenses.length > 0 ? total / expenses.length : 0
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/expenses`);
});