const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const HangmanAnswer = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  _hangman: {
    type: ObjectId,
    ref: 'Hangman'
  },
  approved: {
    type: Boolean,
    default: true
  },
  moves: Number
}, { timestamps: true });

module.exports = mongoose.model('HangmanAnswer', HangmanAnswer);
