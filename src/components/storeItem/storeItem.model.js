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
