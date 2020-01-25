const userModel = require('../../user/user.model');
const Hangman = require('./hangman.model');

exports.getHangman = async (req, res, next) => {
  const hangman = await Hangman.findById(req.params.hangmanId);
  if (!hangman) return res.status(404).send('Hangman not found');

  req.hangman = hangman;
  next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.type === userModel.userTypes.TEACHER &&
    !(req.user.id === String(req.hangman._user))) {
    return res.status(401).send('Only the owner teacher can change this');
  }
  next();
};
