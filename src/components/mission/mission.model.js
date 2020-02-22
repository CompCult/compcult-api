const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Mission = new Schema({
  name: String,
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  users: {
    type: [{ type: ObjectId, ref: 'User' }]
  },
  description: String,
  lux: Number,
  resources: Number,
  secret_code: String,
  is_public: {
    type: Boolean,
    default: false
  },
  is_grupal: {
    type: Boolean,
    default: false
  },
  single_answer: {
    type: Boolean,
    default: true
  },
  has_image: {
    type: Boolean,
    default: false
  },
  has_audio: {
    type: Boolean,
    default: false
  },
  has_video: {
    type: Boolean,
    default: false
  },
  has_text: {
    type: Boolean,
    default: false
  },
  has_geolocation: {
    type: Boolean,
    default: false
  },
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
}, { toJSON: {} });

module.exports = mongoose.model('Mission', Mission);
