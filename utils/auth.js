const jwt = require('./jwt');
const config = require('../config/app.config');
const models = require('../models/models');

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        console.log(req.body)
        const token = req.body.token || '';
        Promise.all([
            jwt.verifyToken(token),
        ]).then(([data]) => {
            models.User.findById(data.id).then(user => {
                req.user = user;
                next();
            });
        }).catch(err => {
            if (!redirectUnauthenticated) { next(); return; }
            next(err);
        });
    };
}

module.exports = auth;