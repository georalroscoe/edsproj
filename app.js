const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Update = require('./models/update');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/ed');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('./index')
});

app.get('/updates/new', async (req, res) => {
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

app.get('/updates/show', (req, res) => {

    res.render('updates/show')
});

app.post('/updates', async (req, res) => {
    const update = new Update(req.body.update);
    await update.save();
    res.redirect(`/updates/${update._id}`)
});

app.get('/updates/:id', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('updates/show', { update });
});

app.get('/updates/:id/edit', async (req, res) => {
    const update = await Update.findById(req.params.id);
    res.render('updates/edit', { update })
});

app.put('/updates/:id', async (req, res) => {
    const { id } = req.params;
    const update = await Update.findByIdAndUpdate(id, { ...req.body.update });
    res.redirect(`/updates/${update._id}`)
});


app.delete('/updates/:id', async (req, res) => {
    const { id } = req.params;
    await Update.findByIdAndDelete(id);
    res.redirect('/')
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
});


// Update.find({ hour: 'nine' })
//         .then(function (err, data) {
//             if (!err) {
//                 res.send(data);
//             } else {
//                 throw err;
//             }
//         }).catch((err) => {
//             console.log(err);
//         });