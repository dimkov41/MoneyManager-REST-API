const {body} = require('express-validator');

module.exports = [
    body('merchant', 'Merchant should be at least 4 characters long')
        .isLength({min:4}),

    body('description', 'Description should be at least 10 characters long...')
        .isLength({min: 20}),

    body('description', "Description should be less than 50 characters long...")
        .isLength({max: 50})
];