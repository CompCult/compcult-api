const { User, userTypes } = require('../user/user.model.js');
const Quiz = require('../quiz/quiz.model.js');
const QuizAnswer = require('./quizAnswer.model.js');
const mongoose = require('mongoose');

exports.listQuizAnswers = async (req, res) => {
  const query = {
    ...req.query,
    _quiz: req.params.quizId
  };

  if (req.user.type === userTypes.STUDENT) {
    query._user = req.user.id;
  }

  const quizAnswers = await QuizAnswer.find(query)
    .populate({ path: '_user', select: 'name' })
    .populate({ path: '_quiz', select: 'title start_time' });
  res.send(quizAnswers);
};

exports.getQuizAnswer = async (req, res) => {
  res.send(req.quizAnswer);
};

exports.createQuizAnswer = async (req, res) => {
  const quizAnswer = new QuizAnswer({
    ...req.body,
    _user: req.user.id,
    _quiz: req.params.quizId,

    approved: await verifyAnswer(req.params.quizId, req.body.answer)

  });
  const id = mongoose.Types.ObjectId(req.user.id);
  const quiz = await Quiz.findById(req.params.quizId);
  quiz.users.push(id);
  await quiz.save();
  await quizAnswer.save();
  res.status(201).send(quizAnswer);
};

exports.updateQuizAnswer = async (req, res) => {
  req.quizAnswer.set(req.body);
  res.send(req.quizAnswer);
};

exports.deleteQuizAnswer = async (req, res) => {
  req.quizAnswer.delete();
  res.send(req.quizAnswer);
};

async function verifyAnswer(quizId, answer) {
  let quiz = await Quiz.findById(quizId);

  if (quiz.correct_answer && quiz.correct_answer === answer) {
    recompenseUser(answer._user, quiz.points);
    return true;
  } else if (quiz.correct_answer && quiz.correct_answer !== answer.answer) {
    return false;
  }
};

function recompenseUser(userId, points) {
  User.findById(userId, function (err, user) {
    if (err) throw err;

    if (user) {
      user.points += points;
      user.save(function (err) {
        if (err) throw err;
      });
    }
  });
};
