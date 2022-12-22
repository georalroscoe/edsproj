const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose');
const { append } = require('express/lib/response');
const { response } = require('express');
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

let incident = function (arr) {
    let count = 0;
    for (let a of arr) {
        if (a !== 'none') {
            count++
        }
    }
    return count
}

let sortByDate = function sortByDate(a, b) {
    return a[0] - b[0] || a[1] - b[1];

};

let dayMean = function (arr) {
    let x = []
    let y = 0
    let score = 0
    let count = 0

    for (i = 1; i < arr.length; i++) {

        if (arr[i][0] === arr[i - 1][0]) {
            y = arr[i - 1][0]
            score += arr[i - 1][1]
            count++


        }
        else {
            y = arr[i - 1][0]
            score += arr[i - 1][1]
            count++

            x.push([y, score / count])
            score = 0
            count = 0

        }
    }
    if (arr.length > 2) {
        y = arr[arr.length - 1][0]
        score += arr[arr.length - 1][1]
        count++
        x.push([y, score / count])
    }
    return x
};






router.get('/analysis', async (req, res, next) => {
    let updates = []
    await db.collection('updates')
        .find()
        .forEach(update => updates.push(update))
    const moodDayArr = (dayMean(updates.map((x) => [(x.time.month * 30 + x.time.day), x.mood]).sort(sortByDate)));
    const personInc = updates.map((x) => [x.person, x.incident]);
    const activityMood = updates.map((x) => [x.activity, x.mood]);
    res.render('analysis/show', { moodDayArr, personInc, activityMood })
});


router.get('/analysis/leighan', async (req, res) => {
    let leighan = [];
    await db.collection('updates')
        .find({ 'person': 'Leighan' })
        .forEach(x => leighan.push(x));
    const mood = mean(leighan.map((x) => x.mood));
    const incidents = incident(leighan.map((x) => x.incident));
    const noInc = leighan.length;
    res.render('analysis/leighan/show', { mood, incidents, noInc })
});

router.get('/links/:number', async (req, res) => {
    let month = req.params.number;
    let Month = parseInt(month);
    let updates = [];
    await db.collection('updates')
        .find({ 'time.month': { $eq: Month } })
        .forEach(update => updates.push(update));
    const graph = (dayMean(updates.map((x) => [x.time.day, x.mood]).sort(sortByDate)));

    res.render('analysis/links/graph', { graph })

})


module.exports = router