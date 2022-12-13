const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose')
const db = mongoose.connection;
const Night = require('../models/night');

let mush = 'gfgfg'

router.get('/9/new', async (req, res) => {
    console.log('mush')
    let q = {};
    await db.collection('updates').findOne({ hour: 9 }).then(function (result) {
        q = result;
        if (q == null) {
            console.log('empty')
            res.render('9/new')
        }
        else {
            console.log('full');
            res.redirect(`/9/${q._id}`)
            console.log(q._id)
        }

    }, function (err) {
        return console.log(err);
    });
});

router.get('/9/show', (req, res) => {

    res.render('9/show')
});

router.post('/9', async (req, res) => {
    const update = new Update(req.body.update);
    await update.save();
    res.redirect(`/9/${update._id}`)
});

router.get('/9/:id', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('9/show', { update });
});

router.get('/9/:id/edit', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('9/edit', { update })
});

router.put('/9/:id', async (req, res) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect(`/9/${update._id}`)
});


router.delete('/9/:id', async (req, res) => {
    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/')
});


router.post('/night', async (req, res) => {
    const night = new Night(req.body.night);
    await night.save();
    res.redirect('/')
});

module.exports = router;