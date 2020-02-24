const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Memory = new Schema({
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
  secret_code: { type: String, default: generateSecretCode },
  is_public: Boolean,
  images: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

function generateSecretCode () {
  var text = '';
  var possible = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';

  for (var i = 0; i < 6; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};

module.exports = mongoose.model('Memory', Memory);
