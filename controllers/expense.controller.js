const models = require('../models/models');
const config = require('../config/app.config');
const {validationResult} = require('express-validator');

module.exports = {
    get: {
        create: (req, res, next) => {
            const hbsObject = {
                isLoggedIn: req.cookies[config.cookie] !== undefined,
                username: req.user.username
            };
            res.render('createExpense.hbs', hbsObject);
        },

        details: (req, res) => {
            const {expenseId} = req.params;

            models.Expense.findById(expenseId).then((expense) => {
                const hbsObject = {
                    expense,
                    username: req.user ? req.user.username : "",
                    isLoggedIn: req.cookies[config.cookie] !== undefined
                };
                res.render('detailsExpense.hbs', hbsObject);
            })
        },
        delete: (req, res, next) => {
            const {expenseId} = req.params;

            models.Expense.findByIdAndRemove(expenseId).then((removedExpense) => {
                res.redirect('/');
            });
        }
    },

    post: {
        create: (req, res, next) => {
            const {merchant, total, category, description, report} = req.body;
            if (!merchant || !total || !description) {
                return res.render("createExpense.hbs", {error: 'Please fill all fields'});
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('createExpense.hbs', {
                    error: errors.array()[0].msg,
                })
            } else if (total < 0) {
                return res.render('createExpense.hbs', {
                    error: "Total should be positive number"
                })
            } else if (!category) {
                return res.render('createExpense.hbs', {
                    error: 'The category should one from the given options'
                })
            }

            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1; //January is 0!
            let yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            today = dd + '/' + mm + '/' + yyyy;

            models.Expense.create({
                merchant,
                total,
                category,
                description,
                report: !!report,
                creator: req.user.id,
                date: today.toString()
            }).then((expense) => {
                models.User.findById(req.user.id).then(user => {
                    user.expenses.push(expense);
                    models.User.findByIdAndUpdate(user.id, {expenses: user.expenses})
                        .then(updatedUser => {
                            return res.redirect("/");
                        })
                });
            })
        }
    }
};