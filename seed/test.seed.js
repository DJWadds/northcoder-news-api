const seedDB = require('./seed');
const { articlesData, topicsData, usersData } = require('./testData');
const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/northcoders_news_test')
  .then(() => seedDB(topicsData, usersData, articlesData))
  .then(() => mongoose.disconnect());