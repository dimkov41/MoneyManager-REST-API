const router = require('express').Router();
const controllers = require('../controllers/controllers');
const auth = require('../utils/auth');
const expenseValidator = require('../utils/validator');

router.get('/create', auth(), controllers.expenses.get.create);

router.post('/create', auth(), expenseValidator, controllers.expenses.post.create);

router.get('/details/:expenseId', auth(), controllers.expenses.get.details);

router.get('/delete/:expenseId', auth(), controllers.expenses.get.delete);

module.exports = router;