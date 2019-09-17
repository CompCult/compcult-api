const userModel = require('../user/user.model');
const Mission = require('./mission.model');

exports.getMission = async (req, res, next) => {
  const mission = await Mission.findById(req.params.missionId);
  if (!mission) return res.status(404).send('Mission not found');

  req.mission = mission;
  next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.type === userModel.userTypes.TEACHER &&
    !(req.user.id === String(req.mission._user))) {
    return res.status(401).send('Only the owner teacher can change this');
  }
  next();
};
