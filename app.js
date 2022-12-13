const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const methodOverride = require('method-override');
const nineroutes = require('./routes/9routes');
const tenroutes = require('./routes/10routes');
const elevenroutes = require('./routes/11routes');
const twelveroutes = require('./routes/12routes');
const analysisRoutes = require('./routes/analysisRoutes');

mongoose.connect('mongodb://127.0.0.1/ed');

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
}


app.get('/', async (req, res) => {
    let year = new Date().getUTCFullYear();
    let month = new Date().getUTCMonth();
    let day = new Date().getUTCDate(); 6
    let updates = []
    await db.collection('updates')
        .find({
            'time.year': { $eq: year }, 'time.month': { $eq: month }, 'time.day': { $eq: day }
        })
        .forEach(x => updates.push(x));
    console.log(updates)
    const ear = sum(updates.map((x) => x.ear));


    res.render('./index', { ear })
});

if (new Date().getUTCMonth() === 11) { console.log(new Date().getUTCMonth()) }

app.use(nineroutes);
app.use(tenroutes);
app.use(elevenroutes);
app.use(twelveroutes);
app.use(analysisRoutes);

app.listen(3000, () => {
    console.log('Listening on port 3000')
});

