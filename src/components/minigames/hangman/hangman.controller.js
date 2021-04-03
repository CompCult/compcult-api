const Hangman = require('./hangman.model');
const _ = require('lodash');

exports.listHangmans = async (req, res) => {
  let query = _.omit(req.query, ['answered']);
  query = _.pickBy(query, _.identity);

  // if (Object.keys(req.query).includes('answered')) {
  //   if (!Number(req.query.answered)) {
  //     const userId = mongoose.Types.ObjectId(req.user.id);
  //     query.users = { '$not': { '$all': [userId] } };
  //   }
  // }

  const hangmans = await Hangman.find(query);
  res.send(hangmans);
};

exports.getHangman = (req, res) => {
  res.send(req.hangman);
};

exports.createHangman = async (req, res) => {
  const hangman = new Hangman(req.body);
  hangman._user = req.user.id;
  await hangman.save();
  res.send(hangman);
};

exports.updateHangman = async (req, res) => {
  req.hangman.set(req.body);
  await req.hangman.save();

  res.send(req.hangman);
};

exports.deleteHangman = async (req, res) => {
  await req.hangman.delete();
  res.send(req.hangman);
};
