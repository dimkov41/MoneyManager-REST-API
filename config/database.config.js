const mongoose = require('mongoose');
const config = require('./app.config');
const dbName = 'moneyGone';

module.exports = () => {
    return mongoose.connect(config.dbURL + dbName, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
        console.log('***Database is READY!***'));
};