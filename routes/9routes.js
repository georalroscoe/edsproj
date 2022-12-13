const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose')
const db = mongoose.connection;
const Night = require('../models/night');
const { application } = require('express');








router.get('/note/:id', async (req, res) => {
    const update = await Update.findById(req.params.id);
    console.log(update)
    res.render('note/show', { update });
});

router.get('/note/:id/edit', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('note/edit', { update })
});

router.put('/note/:id', async (req, res) => {
    console.log(req.body.update)
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect(`/note/${update._id}`)
});


router.delete('/note/:id', async (req, res) => {

    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/')
});


router.post('/night', async (req, res) => {
    const night = new Night(req.body.night);
    await night.save();
    res.redirect('/')
});


router.post('/note', async (req, res, next) => {
    let { year, month, day } = req.body.update.time;
    let Year = parseInt(year);
    let Month = parseInt(month);
    let Day = parseInt(day);
    const { id, hour } = req.body.update
    let Hour = parseInt(hour)
    console.log(typeof Year)
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
            console.log(q._id)
        }

    }, function (err) {
        return console.log(err);
    });

});

router.post('/note', async (req, res) => {
    const update = new Update(req.body.update);
    console.log(update)
    await update.save();
    res.redirect(`/note/${update.id}/new`)
});

router.get('/note/new', async (req, res) => {
    res.render('/note/new')
})

router.get('/note/:id/new', async (req, res) => {
    const update = await Update.findById(req.params.id);
    console.log(update)
    res.render('note/new', { update });
});

router.put('/note/:id', async (req, res) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect(`/note/${update._id}`)
});



module.exports = router;