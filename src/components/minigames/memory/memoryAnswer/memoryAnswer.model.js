const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const MemoryAnswer = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  _memory: {
    type: ObjectId,
    ref: 'Memory'
  },
  approved: {
    type: Boolean,
    default: true
  },
  moves: Number
}, { timestamps: true });

module.exports = mongoose.model('MemoryAnswer', MemoryAnswer);
