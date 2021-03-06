const Hangman = require('../hangman.model');
const HangmanAnswer = require('./hangmanAnswer.model');
const { User, userTypes } = require('../../../user/user.model');
const mongoose = require('mongoose');
const _ = require('lodash');

exports.listHangmanAnswers = async (req, res) => {
  let query = {
    ...req.query,
    _hangman: req.params.hangmanId
  };
  query = _.pickBy(query, _.identity);

  if (req.query.type === userTypes.STUDENT) {
    query._user = req.user.id;
  }

  const hangmanAnswers = await HangmanAnswer.find(query)
    .populate({ path: '_user', select: 'name' })
    .populate({ path: '_hangman', select: 'title' });
  res.send(hangmanAnswers);
};

exports.createHangmanAnswer = async (req, res) => {
  const hangmanAnswer = new HangmanAnswer({
    ...req.body,
    _user: req.user.id,
    _hangman: req.params.hangmanId
  });
  const userId = mongoose.Types.ObjectId(req.user.id);
  const hangman = await Hangman.findById(req.params.hangmanId);

  if (!hangman.users.includes(userId)) {
    hangman.users.push(userId);
    await hangman.save();
    await hangmanAnswer.save();
    await User.findByIdAndUpdate(req.user.id, { $inc: { lux: hangman.lux, resources: hangman.resources } });
    res.status(201).send(hangmanAnswer);
  }

  res.status(400).send('User has already responded');
};
