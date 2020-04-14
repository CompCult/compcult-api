const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const StoreItem = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  users: {
    type: [{ type: ObjectId, ref: 'User' }]
  },
  title: String,
  description: String,
  quantity: {
    type: Number,
    default: 0
  },
  isCreatedByMission: {
    type: Boolean,
    default: false
  },
  missionId: {
    type: ObjectId,
    ref: 'Mission'
  },
  value: {
    type: Number,
    required: true
  },
  image: String,
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date
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

  image: String,
  audio: String,
  video: String,
  text: String,
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

StoreItem.plugin(mongoosePaginate);

StoreItem.virtual('active').get(function () {
  return this.end_time
    ? this.start_time.getTime() <= Date.now() && Date.now() <= this.end_time.getTime()
    : this.start_time.getTime() <= Date.now();
});

module.exports = mongoose.model('StoreItem', StoreItem);
