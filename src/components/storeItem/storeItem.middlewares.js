const userModel = require('../user/user.model');
const StoreItem = require('./storeItem.model');

exports.getItem = async (req, res, next) => {
  const item = await StoreItem.findById(req.params.itemId);
  if (!item) return res.status(404).send('Item not found');

  req.item = item;
  next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.type === userModel.userTypes.TEACHER &&
    !(req.user.id === String(req.item._user))) {
    return res.status(401).send('Only the owner teacher can change this');
  }
  next();
};