const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const Joi = require('joi');

const userTypes = {
  'TEACHER': 'professor',
  'STUDENT': 'estudante',
  'MANAGER': 'gestor',
  'COMMON': 'usuarioComum'
};

const userSchema = new mongoose.Schema({
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
    enum: Object.values(userTypes),
    required: true
  },
  institution: String,
  password: {
    type: String,
    required: true
  },
  can_edit: {
    type: Boolean,
    default: false
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
  lux: {
    type: Number,
    default: 0
  },
  sec_points: {
    type: Number,
    default: 0
  },

  resources: {
    type: Number,
    default: 0
  },

  imp: {
    type: Number,
    default: 0
  },

  people: {
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

userSchema.plugin(mongoosePaginate);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function () {
  const payload = { id: this._id, type: this.type };
  const token = jwt.sign(payload, config.get('jwtSecret'));

  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().valid(Object.values(userTypes)).required(),
    institution: Joi.string().required(),
    picture: Joi.string()
  };

  return Joi.validate(user, schema);
};

module.exports = { User, validateUser, userTypes };
