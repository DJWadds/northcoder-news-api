const seedDB = require('./seed');
const {DB_URL} = require('../config') || {DB_URL: 'mongodb://localhost:27017/northcoders_news'}
const { articlesData, topicsData, usersData } = require('./devData');
const mongoose = require('mongoose');

console.log(DB_URL)

mongoose
  .connect(DB_URL)
  .then(() => seedDB(topicsData, usersData, articlesData))
  .then(() => mongoose.disconnect());