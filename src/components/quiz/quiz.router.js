const express = require('express');
const router = express.Router();

const userMiddleware = require('../user/user.middlewares');
const quizMiddleware = require('./quiz.middlewares');
const userModel = require('../user/user.model');
const quizCtrl = require('./quiz.controller');
const quizAnswerRouter = require('../quizAnswer/quizAnswer.router');

router.use('/:quizId/answers', quizAnswerRouter);

router.get('/', quizCtrl.listQuizzes);

router.get('/:quizId', [
  quizMiddleware.getQuiz
], quizCtrl.getQuiz);

router.get('/public', quizCtrl.findPublicQuizzes);

router.get('/private', quizCtrl.findPrivateQuiz);

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

module.exports = router;
