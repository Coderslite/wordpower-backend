const express = require('express');

const morgan = require('morgan');

const app = express();

const userRoute = require('./api/routes/users');


app.use(morgan('dev'))

app.use('/users', userRoute);

module.exports = app;