const models = require('../models/models');
const config = require('../config/app.config');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

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
            const { expenseId } = req.params;

            models.Expense.findById(expenseId).then((expense) => {
                const hbsObject = {
                    expense,
                    username: req.user ? req.user.username : "",
                    isLoggedIn: req.cookies[config.cookie] !== undefined
                };
                res.render('detailsExpense.hbs', hbsObject);
            })
        }
    },

    post: {
        create: (req, res) => {
            const { merchant, total, description } = req.body;
            if (!merchant || !total || !description) {
                return res.status(500).send({ error: 'Please, fill all fields' });
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).send({ error: errors.array()[0].msg });
            } else if (total < 0) {
                return res.status(500).send({ error: "Total should be positive number" });
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
                description,
                creator: req.user.id,
                date: today.toString()
            }).then((expense) => {
                models.User.findById(req.user.id).then(user => {
                    user.expenses.push(expense);
                    console.log("Expense created")
                    console.log(expense);
                    models.User.findByIdAndUpdate(user.id, { expenses: user.expenses })
                        .then(updatedUser => {
                            return res.status(200).send({});
                        })
                });
            })
        },
        all: (req, res) => {
            let token = req.body.token;
            let decodedToken = jwt.decode(token);
            models.Expense.find({ creator: decodedToken.id }).then((expenses) => {
                res.status(200).send({expenses});
            });
        },
        delete: (req, res) => {
            const { expenseId } = req.body;
            console.log("Expense id" + expenseId)
            models.Expense.findByIdAndRemove(expenseId).then((removedExpense) => {
                console.log("removed expense" + removedExpense)
                res.status(200).send({});
            }).catch(e => {
                console.log(e)
                res.status(500).send({})
            });
        }
    }
};