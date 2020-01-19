const { Asset } = require('./asset.model');

exports.validateAsset = (req, res, next) => {
  const { error } = Asset(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  next();
}
