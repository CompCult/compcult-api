const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Simulation = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  initialDate: Date,
  finalDate: Date,
  initialAmount: Number,
  secretCode: String,
  timeJump: {
    type: String,
    enum: ['month', 'year'],
    default: 'year'
  }

}, { timestamps: true });

module.exports = mongoose.model('Simulation', Simulation);
