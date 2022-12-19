const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const methodOverride = require('method-override');
const nineroutes = require('./routes/9routes');

const analysisRoutes = require('./routes/analysisRoutes');

mongoose.connect("mongodb+srv://george:roscoe8oak@cluster0.nkgit9o.mongodb.net/?retryWrites=true&w=majority");

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

app.use(express.static('public'));

let sum = function (arr) {
    let sum = 0;
    for (let a of arr) {
        sum += a
    }
    return sum
};

app.get('/', async (req, res) => {
    let year = new Date().getUTCFullYear();
    let month = new Date().getUTCMonth();
    let day = new Date().getUTCDate();
    let updates = []
    let nights = []
    let event = 1
    let wake = 0
    db.collection('updates').deleteMany({
        person: { $exists: false }
    });
    await db.collection('updates')
        .find({
            'time.year': { $eq: year }, 'time.month': { $eq: month }, 'time.day': { $eq: day }
        })
        .forEach(x => updates.push(x));
    await db.collection('nights')
        .find({
            'time.year': { $eq: year }, 'time.month': { $eq: month }, 'time.day': { $eq: day }
        })
        .forEach(x => nights.push(x));
    const hours = updates.map((x) => x.hour);
    if (nights.length > 0) {
        event = (nights[0].nightEvents)
        wake = nights[0].wake
    }

    const ear = sum(updates.map((x) => x.ear));


    res.render('./index', { ear, hours, wake, event })
});


app.use(nineroutes);
app.use(analysisRoutes);

app.listen(3000, () => {
    console.log('Listening on port 3000')
});

