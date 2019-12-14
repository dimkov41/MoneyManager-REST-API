const models = require('../models/models');
const jwt = require('../utils/jwt');
const config = require('../config/app.config');
const {validationResult} = require('express-validator');

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('loginPage.hbs', {pageTitle: 'Login Page'});
        },

        profile: (req, res, next) => {
            models.User.findById(req.user.id).then(user => {
                console.log(user);
                console.log(user.expenses);
                let totalExpenses = user.expenses.length;

                const obj = {
                    username: req.user ? req.user.username : "",
                    isLoggedIn: req.cookies[config.cookie] !== undefined,
                    user,
                    totalExpenses
                };

                res.render('userProfile.hbs', obj);
            });


        },

        register: (req, res, next) => {
            res.render('registerPage.hbs', {pageTitle: 'Register Page'});
        },

        logout: (req, res, next) => {
            res.clearCookie(config.cookie).clearCookie(config.usernameCookie).redirect('/');
        }
    },

    post: {
        login: (req, res, next) => {
            const {username, password} = req.body;
            const errors = validationResult(req);
            if (!username || !password) {
                res.render('loginPage.hbs', {error: "Please fill all fields"});
                return;
            } else if (!errors.isEmpty()) {
                return res.render('loginPage.hbs', {
                    error: errors.array()[0].msg,
                })
            }

            models.User.findOne({username}).then((user) => {
                if (!user) {
                    res.render('loginPage.hbs', {error: 'User does not exists'});
                } else {
                    Promise.all([user, user.matchPassword(password)])
                        .then(([user, match]) => {
                            if (!match) {
                                res.render('loginPage.hbs', {error: 'Password is invalid'});
                                return;
                            }

                            const token = jwt.createToken({id: user._id});

                            res
                                .cookie(config.cookie, token)
                                .redirect('/');

                        })
                }
            })
        },

        register: (req, res) => {
            const {username, password, repeatPassword, amount} = req.body;
            const errors = validationResult(req);
            console.log(req.body);
            if (!username || !password || !repeatPassword || !amount) {
                res.status(500).send( {error: 'Please, fill all fields'} );
            } else if (!errors.isEmpty()) {
                res.status(500).send( {error: errors.array()[0].msg} );
            } else if(amount < 0){
                res.status(500).send( {error: 'Amount should be positive number'} )
            } else if (password !== repeatPassword) {
                res.status(500).send( {error: 'Passwords does not match'} );
            } else {
                models.User.create({username, password, amount}).then((registeredUser) => {
                    const token = jwt.createToken({id: registeredUser._id});
                    res.status(200).send({token})
                }).catch((err) => {
                    if(err.keyPattern.username != null){
                        res.status(500).send({error: "Username Already exists"});
                        return;
                    }
                    res.status(500).send({error: "Database Error"});
                })
            }
        },
        refill: (req, res) => {
            if (req.user) {
                let {amount} = req.body;

                models.User.findById(req.user.id).then(user => {
                    amount = Number(amount) + Number(user.amount);
                    models.User.findByIdAndUpdate(user.id, {amount})
                        .then(updatedUser => {
                            res.redirect("/");
                        })
                });
            } else {
                res.redirect("/");
            }
        }
    }
};