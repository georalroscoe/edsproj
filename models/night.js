const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const NightSchema = new Schema({
    time: {
        year: Number,
        month: Number,
        day: Number
    },
    wake: Number,
    nightEvents: Boolean

});

module.exports = mongoose.model('Night', NightSchema);