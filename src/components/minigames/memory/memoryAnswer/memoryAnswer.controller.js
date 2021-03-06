const Memory = require('../memory.model');
const MemoryAnswer = require('./memoryAnswer.model');
const { User, userTypes } = require('../../../user/user.model');
const mongoose = require('mongoose');
const _ = require('lodash');

exports.listMemoryAnswers = async (req, res) => {
  let query = {
    ...req.query,
    _memory: req.params.memoryId
  };
  query = _.pickBy(query, _.identity);

  if (req.query.type === userTypes.STUDENT) {
    query._user = req.user.id;
  }

  const memoryAnswers = await MemoryAnswer.find(query)
    .populate({ path: '_user', select: 'name' })
    .populate({ path: '_memory', select: 'name' });
  res.send(memoryAnswers);
};

exports.createMemoryAnswer = async (req, res) => {
  const memoryAnswer = new MemoryAnswer({
    ...req.body,
    _user: req.user.id,
    _memory: req.params.memoryId
  });
  const userId = mongoose.Types.ObjectId(req.user.id);
  const memory = await Memory.findById(req.params.memoryId);
  if(!memory){
    return res.status(404).send('Jogo não encontrado');
  }
  memory.users.push(userId);
  await memory.save();
  await memoryAnswer.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { lux: memory.lux, resources: memory.resources} });

  res.status(201).send(memoryAnswer);
};
