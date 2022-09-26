const express = require('express');

const morgan = require('morgan');

const app = express();

const userRoute = require('./api/routes/users');
const postRoute = require('./api/routes/posts');
const authRoute = require('./api/routes/authentication')
const commentRoute = require('./api/routes/comments')

app.use(morgan('dev'))

app.use('/users', userRoute);
app.use('/posts', postRoute);
app.use('/auth', authRoute);
app.use('/comments',commentRoute);

module.exports = app;