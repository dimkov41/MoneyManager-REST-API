const user = require('./user.router');
const expenses = require('./expense.router');
const home = require('./home.router');

module.exports = {
    user,
    home,
    expenses
};