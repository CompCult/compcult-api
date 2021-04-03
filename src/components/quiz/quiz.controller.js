const Quiz = require('./quiz.model');
// const { userTypes } = require('../user/user.model');
const _ = require('lodash');
const mongoose = require('mongoose');
const utils = require('../../utils');

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

  let query = _.omit(req.query, ['active', 'answered', 'is_public', 'page', 'limit', 'sort', 'order']);
  query = _.pickBy(query, _.identity);

  const regexProperties = ['title'];
  query = utils.regexQuery(query, regexProperties);

  let sort = {};
  if(req.query.sort){
    if(req.query.order && req.query.order != '1' && req.query.order != '-1')
      res.status(400).send('Order must be 1 or -1');
    sort[req.query.sort] = req.query.order || 1;
  }

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


  if (req.query.page) {
    if (!req.query.limit) res.status(400).send('A page parameter was passed without limit');

    const config = {
      sort: sort,
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    };

    const quizzes = await Quiz.paginate(query, config);
    res.send(quizzes);
  } else {
    const quizzes = await Quiz.find(query).sort(sort);
    res.send(quizzes);
  }
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
