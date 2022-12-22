const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose')
const db = mongoose.connection;
const Night = require('../models/night');
const { application } = require('express');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError')


router.get('/note/:id', catchAsync(async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('note/show', { update });
}));



router.put('/note/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect('/')
}));


router.post('/note/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/')
}));

router.delete('/note/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Update.findByIdAndDelete(id)
    res.redirect('/')
}));


router.delete('/night/:id', catchAsync(async (req, res) => {
    const { id } = req.params

    await Night.findByIdAndDelete(id)
    res.redirect('/')

}));


router.post('/night', catchAsync(async (req, res) => {
    const night = new Night(req.body.night);
    await night.save();
    res.redirect('/')
}));


router.post('/note', catchAsync(async (req, res, next) => {
    let { year, month, day } = req.body.update.time;
    let Year = parseInt(year);
    let Month = parseInt(month);
    let Day = parseInt(day);
    const { id, hour } = req.body.update
    let Hour = parseInt(hour)
    let q = {};
    await db.collection('updates').findOne({
        'time.year': { $eq: Year }, 'time.month': { $eq: Month }, 'time.day': { $eq: Day }, 'hour': { $eq: Hour }
    }).then(function (result) {
        q = result;
        if (q == null) {
            console.log('empty');
            next();
        }
        else {
            console.log('full');
            return res.redirect(`/note/${q._id}`)
        }

    }, function (err) {
        return console.log(err);
    });

}));

router.post('/note', catchAsync(async (req, res) => {
    const update = new Update(req.body.update);
    await update.save();
    res.redirect(`/note/${update.id}/new`)
}));



router.get('/note/:id/new', catchAsync(async (req, res) => {

    const update = await Update.findById(req.params.id);
    res.render('note/new', { update });
}));





router.use((err, req, res, next) => {
    const { statusCode = 500, message = 'somin wen wong' } = err;
    res.status(statusCode).send(message)
})


module.exports = router;