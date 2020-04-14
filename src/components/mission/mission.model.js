const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
var { User, userTypes } = require('../user/user.model.js');

const Mission = new Schema({
  name: String,
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  users: {
    type: [{ type: ObjectId, ref: 'User' }]
  },
  accountableTeacher: {
    type: ObjectId,
    ref: 'User',
    //User.type = userTypes.TEACHER,
    filter: (User) => User.type === userTypes.TEACHER,
  },
  isEntrepreneurial: {
    type: Boolean,
    default: false
  },

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
