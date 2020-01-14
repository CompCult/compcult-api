const Memory = require('../memory.model');
const MemoryAnswer = require('./memoryAnswer.model');
const { User } = require('../../../user/user.model');
const mongoose = require('mongoose');

exports.createMemoryAnswer = async (req, res) => {
  const memoryAnswer = new MemoryAnswer({
    ...req.body,
    _user: req.user.id,
    _quiz: req.params.memoryId
  });
  const userId = mongoose.Types.ObjectId(req.user.id);
  const memory = await Memory.findById(req.params.memoryId);
  memory.users.push(userId);
  await memory.save();
  await memoryAnswer.save();

  await User.findByIdAndUpdate(req.user.id, { $inc: { points: memory.points } });

  res.status(201).send(memoryAnswer);
};
