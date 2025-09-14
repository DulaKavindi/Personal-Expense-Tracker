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

  const express = require('express');
  const cors = require('cors');
  const app = express();
  const PORT = 5000;

  app.use(cors());
  app.use(express.json());

  // Import expense routes
  const expenseRoutes = require('./routes/expenses');
  app.use('/api/expenses', expenseRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/expenses`);
  });