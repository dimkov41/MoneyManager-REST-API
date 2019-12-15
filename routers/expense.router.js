const router = require('express').Router();
const controllers = require('../controllers/controllers');
const auth = require('../utils/auth');
const expenseValidator = require('../utils/validator');

router.post('/all', auth(),  controllers.expenses.post.all);

router.get('/create', auth(), controllers.expenses.get.create);

router.post('/create', auth(), expenseValidator, controllers.expenses.post.create);

router.get('/details/:expenseId', auth(), controllers.expenses.get.details);

router.post('/delete', auth(), controllers.expenses.post.delete);

module.exports = router;