const mongoose = require('mongoose');
const models = require('../models/models');
const jwt = require('../utils/jwt');
const jsonwebtoken = require('jsonwebtoken');
const config = require('../config/app.config');
const { validationResult } = require('express-validator');

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('loginPage.hbs', { pageTitle: 'Login Page' });
        },


        register: (req, res, next) => {
            res.render('registerPage.hbs', { pageTitle: 'Register Page' });
        },

        logout: (req, res, next) => {
            res.clearCookie(config.cookie).clearCookie(config.usernameCookie).redirect('/');
        }
    },

    post: {
        login: (req, res) => {
            const { username, password } = req.body;
            const errors = validationResult(req);
            if (!username || !password) {
                res.status(500).send({ error: 'Please, fill all fields' });
            } else if (!errors.isEmpty()) {
                res.status(500).send({ error: errors.array()[0].msg });
            } else {
                models.User.findOne({ username }).then((user) => {
                    if (!user) {
                        //username is not registed
                        res.status(500).send({ error: "Username or password is incorrect" });
                    } else {
                        Promise.all([user, user.matchPassword(password)])
                            .then(([user, match]) => {
                                if (!match) {
                                    //password does not match
                                    res.status(500).send({ error: "Username or password is incorrect" });
                                } else {
                                    const token = jwt.createToken({ id: user._id });
                                    res.status(200).send({ token })
                                }
                            })
                    }
                })
            }
        },

        register: (req, res) => {
            const { username, password, repeatPassword, amount } = req.body;
            const errors = validationResult(req);
            console.log(req.body);
            if (!username || !password || !repeatPassword || !amount) {
                res.status(500).send({ error: 'Please, fill all fields' });
            } else if (!errors.isEmpty()) {
                res.status(500).send({ error: errors.array()[0].msg });
            } else if (amount < 0) {
                res.status(500).send({ error: 'Amount should be positive number' })
            } else if (password !== repeatPassword) {
                res.status(500).send({ error: 'Passwords does not match' });
            } else {
                models.User.create({ username, password, amount }).then((registeredUser) => {
                    const token = jwt.createToken({ id: registeredUser._id });
                    res.status(200).send({ token })
                }).catch((err) => {
                    if (err.keyPattern.username != null) {
                        res.status(500).send({ error: "Username Already exists" });
                        return;
                    }
                    res.status(500).send({ error: "Database Error" });
                })
            }
        },
        refill: (req, res) => {
            let token = req.body.token;
            let decodedToken = jsonwebtoken.decode(token);
            let amount = req.body.amount;

            models.User.findById(req.user.id).then(user => {
                amount = Number(amount) + Number(user.amount);
                models.User.findByIdAndUpdate(user.id, { amount })
                    .then(updatedUser => {
                        res.status(200).send({});
                    })
            });
        },

        profile: (req, res) => {
            let token = req.body.token;
            let decodedToken = jsonwebtoken.decode(token);
            models.User.findById(decodedToken.id).then(user => {
                let arr = [];
                user.expenses.forEach(expenseId => arr.push(mongoose.Types.ObjectId(expenseId)));
                models.Expense.find({ _id: { $in: arr } }).then((expenses) => {
                    res.status(200).send({ user, expenses });
                });
            });
        },
    }
};