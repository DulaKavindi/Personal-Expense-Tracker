const express = require('express');
const router = express.Router();
const ExpensesController = require('../controllers/expensesController');


router.get('/', ExpensesController.getAll);
router.get('/summary/stats', ExpensesController.getSummary);

// Clear all expenses
router.delete('/clear', ExpensesController.clearAll);

// Import expenses (bulk insert)
router.post('/import', ExpensesController.importBulk);

// New Export route
router.get("/export/csv", ExpensesController.exportCsv);

router.get("/", ExpensesController.getAll);
router.get('/:id', ExpensesController.getById);
router.post('/', ExpensesController.create);
router.put('/:id', ExpensesController.update);
router.delete('/:id', ExpensesController.delete);


module.exports = router;
