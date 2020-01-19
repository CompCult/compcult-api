const Joi = require('joi');
const mongoose = require('mongoose');

const Variation = mongoose.model('Variation', new mongoose.Schema({
    variation: {
      type: Number,
      required: true
    },

    month: {
        type: Number,
        required: true
    },

    year: {
      type: Number, 
      required: true
    },

  },{ timestamps: true }));

  module.exports.Variation = Variation;