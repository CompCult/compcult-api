var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

var MissionAnswer = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  _mission: {
    type: ObjectId,
    ref: './mission.js'
  },
  _group: {
    type: Number,
    ref: './group.js'
  },
  status: {
    type: String,
    enum: ['Aprovado', 'Rejeitado', 'Pendente']
  },
  image: String,
  audio: String,
  video: String,
  text_msg: String,
  location_lat: String,
  location_lng: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('mission_answer', MissionAnswer);
