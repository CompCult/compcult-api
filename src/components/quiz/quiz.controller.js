const Quiz = require('./quiz.model');
// const { userTypes } = require('../user/user.model');
const _ = require('lodash');
const mongoose = require('mongoose');

function findPrivateQuiz(req, res) {
  Quiz.findOne({ secret_code: req.query.secret_code }, async function (err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else if (!quiz) {
      res.status(404).send('Quiz não encontrado');
    } else {
        
      const id = mongoose.Types.ObjectId(req.user.id);
      quiz.visible_to.push(id);
      await quiz.save();

      res.status(200).json([quiz]); 
    }
  });
};

exports.listQuizzes = async (req, res) => {

  if (Object.keys(req.query).includes('secret_code')){
    return findPrivateQuiz(req, res);
  }

  let query = _.omit(req.query, ['active', 'answered', 'is_public']);

  if (Object.keys(req.query).includes('is_public')){
    const userId = mongoose.Types.ObjectId(req.user.id);
    query.$or = [
      {is_public: true},
      {visible_to: userId}
    ];
  }

  if (Object.keys(req.query).includes('active')) {
    if (Number(req.query.active)) {
      query.start_time = { '$lte': new Date() };
      query.$or = [
        { end_time: null },
        { end_time: { '$gte': new Date() } }
      ];
    } else {
      query.$or = [
        { start_time: { '$gt': Date.now() } },
        { end_time: { '$lt': Date.now() } }
      ];
    }
  }

  if (Object.keys(req.query).includes('answered')) {
    if (!Number(req.query.answered)) {
      const userId = mongoose.Types.ObjectId(req.user.id);
      query.users = { '$not': { '$all': [userId] } };
    }
  }

  const quizzes = await Quiz.find(query);
  res.send(quizzes);
};

exports.getQuiz = (req, res) => {
  res.send(req.quiz);
};

exports.createQuizz = async (req, res) => {
  const quiz = new Quiz(req.body);
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
