const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const utils = require('../../../utils');

const Hangman = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  users: {
    type: [{ type: ObjectId, ref: 'User' }]
  },
  title: String,
  description: String,
  lux: {
    type: Number,
    min: 0,
    default: 0
  },
  resources: {
    type: Number,
    min: 0,
    default: 0
  },
  secret_code: { type: String, default: utils.randomBytes(6) },
  is_public: Boolean
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Hangman', Hangman);
