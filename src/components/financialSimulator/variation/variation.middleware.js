const { validate } = require('./variation.model');
const Joi = require('Joi');

exports.validateVariation = (req, res, next) => {

  const { error } = Joi.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
}

  


