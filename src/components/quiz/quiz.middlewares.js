const userModel = require('../user/user.model');
const Quiz = require('./quiz.model');

exports.getQuiz = async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).send('Quiz not found');

  req.quiz = quiz;
  next();
};

exports.isOwner = (req, res, next) => {
  if (req.user.type === userModel.userTypes.TEACHER &&
    !(req.user.id === String(req.quiz._user))) {
    return res.status(401).send('Only the owner teacher can change this');
  }
  next();
};
