const MissionAnswer = require('./missionAnswer.model');

exports.getMissionAnswer = async (req, res, next) => {
  const missionAnswer = await MissionAnswer.findById(req.params.missionAnswerId);
  if (!missionAnswer) return res.status(404).send('Quiz answer not found');

  req.missionAnswer = missionAnswer;
  next();
};
