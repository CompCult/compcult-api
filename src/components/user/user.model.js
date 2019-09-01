const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const autoInc = require('mongoose-sequence')(mongoose);
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true
  },
  picture: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  institution: String,
  password: {
    type: String,
    required: true
  },
  new_password: String,
  birth: Date,
  sex: String,
  phone: String,
  street: String,
  complement: String,
  number: Number,
  neighborhood: String,
  city: String,
  state: String,
  zipcode: String,
  points: {
    type: Number,
    default: 0
  },
  sec_points: {
    type: Number,
    default: 0
  },
  request_limit: {
    type: Number,
    default: 5
  },
  banned_until: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(autoInc, { id: 'user_id' });
userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

function validateUser (user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().required()
  };

  return Joi.validate(user, schema);
};

module.exports = { User, validateUser };
