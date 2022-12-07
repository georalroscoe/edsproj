const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const methodOverride = require('method-override');
const updateroutes = require('./routes/updateroutes')

mongoose.connect('mongodb://127.0.0.1/my_database');

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

app.use(updateroutes);

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