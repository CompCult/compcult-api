const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const QuizAnswer = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  _quiz: {
    type: ObjectId,
    ref: 'Quiz'
  },
  answer: String,
  approved: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('quiz_answer', QuizAnswer);
