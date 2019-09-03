const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Quiz = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  title: String,
  description: String,
  points: Number,
  secret_code: String,
  is_public: Boolean,
  single_answer: {
    type: Boolean,
    default: true
  },
  alternative_a: String,
  alternative_b: String,
  alternative_c: String,
  alternative_d: String,
  alternative_e: String,
  correct_answer: String,
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('quiz', Quiz);
