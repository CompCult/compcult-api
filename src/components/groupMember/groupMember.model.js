var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupMember = new Schema({
  _user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  _group: {
    type: Number,
    ref: './group.js'
  },
  is_admin: Boolean,
  joined_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('group_member', GroupMember);
