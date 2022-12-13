const express = require('express');
const Night = require('../models/night');
const router = express.Router();
const mongoose = require('mongoose')
const db = mongoose.connection;



router.post('/night', async (req, res) => {
    const night = new Night(req.body.night);
    await night.save();
    res.redirect('/')
});

module.exports = router;