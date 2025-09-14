const express = require('express');
const router = express.Router();
const ExpensesController = require('../controllers/expensesController');

router.get('/', ExpensesController.getAll);
router.get('/summary/stats', ExpensesController.getSummary);
router.get('/:id', ExpensesController.getById);
router.post('/', ExpensesController.create);
router.put('/:id', ExpensesController.update);
router.delete('/:id', ExpensesController.delete);

module.exports = router;
