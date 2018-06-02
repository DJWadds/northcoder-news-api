const DB_URL = process.env.DB_URL || require('./config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRouter = require('./routers/apiRouter');
const cors = require('cors')

mongoose.connect(DB_URL)
.then(() => {
    console.log(`connected to ${DB_URL}`);
});

app.use(cors());
app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser());
app.use('/api', apiRouter)

// NO ROUTE EXISTS
app.use("/*", (req, res, next) => {
    next({ status: 404});
});

// Error handling
app.use((err, req, res, next) => {
    if (err.status === 400) res.status(400).send({message: "Bad Request"});
    else next(err);
});

app.use((err, req, res, next) => {
    const errImg = 'err404';
    const errobj = {img: errImg, status: 404}
    if (err.status === 404) res.status(404).send({message: "Bad Route"});
    else next(err);
});

app.use((err, req, res, next) => {
    const errImgs = ['errOne', 'errTwo', 'errThree', 'errFour', 'errFive', 'errSix', 'errSeven',];
    const errImg = errImgs[Math.floor(Math.random() * errImgs.length - 1)];
    const errobj = {img: errImg, status: 404}
    res.status(500).send({message: "Server Issue"});
});

module.exports = app;