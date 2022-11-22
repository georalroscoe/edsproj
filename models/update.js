const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UpdateSchema = new Schema({
    person: String,
    mood: Number,
    snack: String,
    incident: String,
    ear: Number,
    activity: String,
    time: Date,
    hour: String

});

module.exports = mongoose.model('Update', UpdateSchema);