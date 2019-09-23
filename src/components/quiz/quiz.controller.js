const Quiz = require('./quiz.model');
// const { userTypes } = require('../user/user.model');
const _ = require('lodash');

exports.listQuizzes = async (req, res) => {
  let query = _.omit(req.query, 'active');

  if (Object.keys(req.query).includes('active')) {
    if (Number(req.query.active)) {
      query.start_time = { '$lte': new Date() };
      query.$or = [{ end_time: null }, { end_time: { '$gte': new Date() } }];
    } else {
      query.$or = [
        { start_time: { '$gt': Date.now() } },
        { end_time: { '$lt': Date.now() } }
      ];
    }
  }

  /*   if (req.user.type === userTypes.STUDENT) {
      if (Object.keys(req.query).contains('answered')) {
        if (Number(req.query.active)) {
          const answers = await QuizAnswer.find({ _quiz: req.quizId, _user: req.user });
          return answers.length > 0;
        }
      }
    } */

  const quizzes = await Quiz.find(query);
  res.send(quizzes);
};

exports.getQuiz = (req, res) => {
  res.send(req.quiz);
};

exports.createQuizz = async (req, res) => {
  var quiz = new Quiz(req.body);
  quiz._user = req.user.id;

  await quiz.save();
  res.send(quiz);
};

exports.updateQuiz = async (req, res) => {
  req.quiz.set(req.body);
  await req.quiz.save();

  res.send(req.quiz);
};

exports.deleteQuiz = async (req, res) => {
  await req.quiz.delete();
  res.send(req.quiz);
};
