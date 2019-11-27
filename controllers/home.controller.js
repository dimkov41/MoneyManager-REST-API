const config = require('../config/app.config');
const models = require('../models/models');

module.exports = {
    get: {
        home: (req, res) => {
            const isLoggedIn = req.cookies[config.cookie] !== undefined;
            if (isLoggedIn) {
                models.Expense.find({creator: req.user.id}).then((expenses) => {
                    const hbsObject = {
                        isLoggedIn: req.cookies[config.cookie] !== undefined,
                        username: req.user ? req.user.username : "",
                        expenses,
                        hasExpenses: expenses.length > 0
                    };
                    res.render('homePage.hbs', hbsObject);
                });
            } else {
                res.render('homePage.hbs');
            }
        }
    },
};