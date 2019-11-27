const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;
const Model = mongoose.model;
const {String, Boolean, ObjectId, Date, Number} = Schema.Types;

const expenseSchema = new Schema({
    merchant: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true,
        min: [10, "Description should be at least 10 characters long..."],
        max: [50, "Description should be less than 50 characters long..."]
    },

    category: {
        type: String,
        required: true
    },

    report: {
        type: Boolean,
        required: true,
        default: false
    },

    creator: {
        type: ObjectId,
        ref: 'User'
    },
});

module.exports = new Model('Expense', expenseSchema);