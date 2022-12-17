const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const UpdateSchema = new Schema({
    person: String,
    mood: Number,
    food: String,
    incident: String,
    ear: Number,
    activity: String,
    time: {
        year: Number,
        month: Number,
        day: Number
    },
    hour: Number

});

module.exports = mongoose.model('Update', UpdateSchema);