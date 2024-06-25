const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegisterUser',
    required: true
  },
  recipe: {
    type:String,
    required: false
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  replies: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisterUser' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Comment', CommentSchema);



