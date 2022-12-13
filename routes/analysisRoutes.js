const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose');
const { append } = require('express/lib/response');
const db = mongoose.connection;

let mean = function (arr) {
    let meanMood = 0
    let count = 0
    for (let a of arr) {
        meanMood += a
        count++
    }
    return meanMood / count
};

let total = function (arr) {
    let sum = 0
    for (let a of arr) {
        sum += a
    }
    return sum
};

let incident = function (arr) {
    let count = 0;
    for (let a of arr) {
        if (a !== 'none') {
            count++
        }
    }
    return count
}


router.get('/analysis', async (req, res, next) => {
    let updates = []
    await db.collection('updates')
        .find()
        .forEach(update => updates.push(update))
    const mood = mean(updates.map((x) => x.mood));
    const tweak = total(updates.map((x) => x.ear));
    const personInc = updates.map((x) => [x.person, x.incident]);
    console.log(personInc)
    res.render('analysis/show', { mood, tweak, personInc })
});

router.get('/analysis/leighen', async (req, res) => {
    let leighen = [];
    await db.collection('updates')
        .find({ 'person': 'Leighen' })
        .forEach(x => leighen.push(x));
    const mood = mean(leighen.map((x) => x.mood));
    const incidents = incident(leighen.map((x) => x.incident));
    const noInc = leighen.length;
    res.render('analysis/leighen/show', { mood, incidents, noInc })


})

module.exports = router