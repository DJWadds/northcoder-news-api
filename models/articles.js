const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    requied: true
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'topics',
    required: true
  },
  likes: {
    type: Array,
    required: true,
    default: []
  },
  dislikes: {
    type: Array,
    required: true,
    default: []
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  comments: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('articles', ArticleSchema);
