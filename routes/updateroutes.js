const express = require('express');
const Update = require('../models/update');
const router = express.Router();
const mongoose = require('mongoose')
const db = mongoose.connection;



router.get('/updates/new', async (req, res) => {
    let q = {};
    await db.collection('updates').findOne({ hour: 'nine' }).then(function (result) {
        q = result;
        if (q == null) {
            console.log('empty')
            res.render('updates/new')
        }
        else {
            console.log('full');
            res.redirect(`/updates/${q._id}`)
            console.log(q._id)
        }

    }, function (err) {
        return console.log(err);
    });
});

router.get('/updates/show', (req, res) => {

    res.render('updates/show')
});

router.post('/updates', async (req, res) => {
    const update = new Update(req.body.update);
    await update.save();
    res.redirect(`/updates/${update._id}`)
});

router.get('/updates/:id', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('updates/show', { update });
});

router.get('/updates/:id/edit', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('updates/edit', { update })
});

router.put('/updates/:id', async (req, res) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect(`/updates/${update._id}`)
});


router.delete('/updates/:id', async (req, res) => {
    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/')
});

module.exports = router;