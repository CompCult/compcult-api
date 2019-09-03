const express = require('express');
const router = express.Router();
const userMiddleware = require('../user/user.middlewares');
const quizMiddleware = require('./quiz.middlewares');
const userModel = require('../user/user.model');

const quizCtrl = require('./quiz.controller');

router.get('/', quizCtrl.listQuizzes);

router.get('/public', quizCtrl.findPublicQuizzes);

router.get('/private', quizCtrl.findPrivateQuiz);

router.get('/query/fields', quizCtrl.findQuizzByParams);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER)
], quizCtrl.createQuizz);

router.put('/:quizId', [
  quizMiddleware.getQuiz,
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  quizMiddleware.isOwner
], quizCtrl.updateQuiz);

router.delete('/:quizId', [
  quizMiddleware.getQuiz,
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  quizMiddleware.isOwner
], quizCtrl.deleteQuiz);

router.get('/:quiz_id', quizCtrl.getQuiz);

module.exports = router;
