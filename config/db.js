const mongoose = require('mongoose');

function conntectDB() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('MongoDB connected successfully');
}
module.exports = conntectDB;