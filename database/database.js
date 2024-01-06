const mongoose = require("mongoose");

const connectionDb = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
}

module.exports = connectionDb;