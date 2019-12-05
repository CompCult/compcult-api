const mongoose = require('mongoose');

const QuizAnswer = require('../quizAnswer/quizAnswer.model.js');

exports.calculateQuizAnswers = async (req, res) => {
  const alternativesAmount = await QuizAnswer
    .aggregate([
      { $match: { _quiz: mongoose.Types.ObjectId(req.params.quizId) } },
      { $group: { _id: '$answer', amount: { $sum: 1 } } }
    ]);

  const answers = alternativesAmount.reduce((result, current) => {
    result[current._id] = current.amount;
    return result;
  }, {
    'a': 0,
    'b': 0,
    'c': 0,
    'd': 0,
    'e': 0
  })

  res.send({ answers, correctAnswer: req.quiz.correct_answer });
}