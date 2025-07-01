const express = require('express');
const app= express();
const Userrouter = require('./routes/user.routes');
const morgan = require('morgan');
const connectDB = require('./config/db');

const dotenv = require('dotenv');
dotenv.config();
connectDB(); // Connect to MongoDB


app.use(morgan('dev'));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use('/user', Userrouter);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});