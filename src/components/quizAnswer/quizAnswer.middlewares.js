const QuizAnswer = require('./quizAnswer.model');

exports.getQuizAnswer = async (req, res, next) => {
  const quizAnswer = await QuizAnswer.findById(req.params.quizAnswerId);
  if (!quizAnswer) return res.status(404).send('Quiz answer not found');

  req.quizAnswer = quizAnswer;
  next();
};
