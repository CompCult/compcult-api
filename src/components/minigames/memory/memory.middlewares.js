const userModel = require('../../user/user.model');
const Memory = require('./memory.model');

exports.getMemory = async (req, res, next) => {
  const memory = await Memory.findById(req.params.memoryId);
  if (!memory) return res.status(404).send('Memory not found');

  req.memory = memory;
  next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.type === userModel.userTypes.TEACHER &&
    !(req.user.id === String(req.memory._user))) {
    return res.status(401).send('Only the owner teacher can change this');
  }
  next();
};
