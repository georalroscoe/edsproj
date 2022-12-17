const mongoose = require('mongoose');
const { person, mood, food, ear, activity, incident } = require('./seedHelpers');
const Update = require('../models/update');

mongoose.connect('mongodb://127.0.0.1/ed');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    // await Update.deleteMany({});
    for (let i = 0; i < 4000; i++) {
        const ranMood = Math.floor(Math.random() * 10) + 1
        const day = Math.floor(Math.random() * 30) + 1;
        const month = Math.floor(Math.random() * 12);
        const ear = Math.floor(Math.random() * 5) * 5;
        const hour = Math.floor(Math.random() * 13) + 9;
        const update = new Update({
            person: `${sample(person)}`,
            food: `${sample(food)}`,
            mood: ranMood,
            time: {
                year: 2022,
                month: month,
                day: day
            },
            incident: `${sample(incident)}`,
            activity: `${sample(activity)}`,
            ear: ear,
            hour: hour
        })
        await update.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})