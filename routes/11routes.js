const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose')
const db = mongoose.connection;



router.get('/11/new', async (req, res) => {
    let q = {};
    await db.collection('updates').findOne({ hour: 11 }).then(function (result) {
        q = result;
        if (q == null) {
            console.log('empty')
            res.render('11/new')
        }
        else {
            console.log('full');
            res.redirect(`/11/${q._id}`)
            console.log(q._id)
        }

    }, function (err) {
        return console.log(err);
    });
});

router.get('/11/show', (req, res) => {

    res.render('11/show')
});

router.post('/11', async (req, res) => {
    const update = new Update(req.body.update);
    await update.save();
    res.redirect(`/11/${update._id}`)
});

router.get('/11/:id', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('11/show', { update });
});

router.get('/11/:id/edit', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('11/edit', { update })
});

router.put('/11/:id', async (req, res) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect(`/11/${update._id}`)
});


router.delete('/11/:id', async (req, res) => {
    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/')
});

module.exports = router;