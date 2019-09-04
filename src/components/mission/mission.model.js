const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Mission = new Schema({
  name: String,
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  description: String,
  points: Number,
  secret_code: String,
  is_public: Boolean,
  is_grupal: Boolean,
  single_answer: {
    type: Boolean,
    default: true
  },
  has_image: Boolean,
  has_audio: Boolean,
  has_video: Boolean,
  has_text: Boolean,
  has_geolocation: Boolean,
  end_message: String,
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('mission', Mission);
