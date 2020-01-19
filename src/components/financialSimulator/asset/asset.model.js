const Joi = require('joi');
const mongoose = require('mongoose');
const { Variation } = require('../variation/variation.model');


const Asset = mongoose.model('Asset', new mongoose.Schema({
    category: {
      type: String,
      enum: ['banco', 'cambio', 'imoveis', 'acoes'], 
      default: 'banco',
      required: true
    },

    name: {
        type: String,
        required: true
    },

    variations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variation'
  }]
    

  },{ timestamps: true }));

  module.exports = mongoose.model('Asset', Asset);



