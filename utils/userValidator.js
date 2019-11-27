const {body} = require('express-validator');

module.exports = [
    body('username', 'The username should be at least 4 characters long and should consist only english letters and digits')
        .isLength({min: 4})
        .isAlpha(['en-GB']),

    body('password', "The password should be at least 8 characters long")
        .isLength({min: 8}),
];