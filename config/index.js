const path = process.env.NODE_ENV || 'development';
module.exports = require(`./${path}`)