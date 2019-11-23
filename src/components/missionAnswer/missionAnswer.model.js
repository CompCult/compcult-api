var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoInc = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

var MissionAnswer = new Schema({
  _id: Number,
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  _mission: {
    type: ObjectId,
    ref: './mission.js'
  },
  _group: {
    type: ObjectId,
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

MissionAnswer.plugin(autoInc, { id: 'answer_id' });
module.exports = mongoose.model('mission_answer', MissionAnswer);
