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

let activityMean = function (arr) {
    let bed = [];
    let outside = [];
    let outHouse = [];
    let tv = [];
    let chill = [];
    let meal = [];
    for (let a of arr) {
        switch (a[0]) {
            case 'bed':
                console.log('bed');
                break;
            case 'outside':
                console.log('outside');
                break;
            default:
                break;
        }

    }

};

const splitx = function (arr) {
    let x = []
    for (let i = 0; i < 10; i++) {
        x.push(arr[i][0])

    }
    return x
};

const splity = function (arr) {
    let y = []
    for (let i = 0; i < 10; i++) {
        y.push(arr[i][1])

    }
    return y
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


router.get('/analysis/leighen', async (req, res) => {
    let leighen = [];
    await db.collection('updates')
        .find({ 'person': 'Leighen' })
        .forEach(x => leighen.push(x));
    const mood = mean(leighen.map((x) => x.mood));
    const incidents = incident(leighen.map((x) => x.incident));
    const noInc = leighen.length;
    res.render('analysis/leighen/show', { mood, incidents, noInc })
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