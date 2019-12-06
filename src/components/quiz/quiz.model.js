const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Quiz = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  users: {
    type: [{ type: ObjectId, ref: 'User' }]
  },
  title: String,
  description: String,
  points: Number,
  secret_code: { type: String, default: generateSecretCode },
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

Quiz.virtual('active').get(function () {
  return this.end_time
    ? this.start_time.getTime() <= Date.now() && Date.now() <= this.end_time.getTime()
    : this.start_time.getTime() <= Date.now();
});

function generateSecretCode() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};

module.exports = mongoose.model('Quiz', Quiz);
