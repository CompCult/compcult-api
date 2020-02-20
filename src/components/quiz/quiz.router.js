const express = require('express');
const router = express.Router();

const userMiddleware = require('../user/user.middlewares');
const quizMiddleware = require('./quiz.middlewares');
const userModel = require('../user/user.model');
const quizCtrl = require('./quiz.controller');
const quizAnswerRouter = require('../quizAnswer/quizAnswer.router');
const quizAnalyticsRouter = require('../quizAnalytics/quizAnalytics.router');

router.use('/:quizId/answers', quizAnswerRouter);
router.use('/:quizId/analytics', quizMiddleware.getQuiz, quizAnalyticsRouter);

router.get('/', userMiddleware.authorize(), quizCtrl.listQuizzes);

router.get('/:quizId', [
  quizMiddleware.getQuiz
], quizCtrl.getQuiz);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER, true)
], quizCtrl.createQuizz);

router.put('/:quizId', [
  quizMiddleware.getQuiz,
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
  quizMiddleware.isOwner
], quizCtrl.updateQuiz);

router.delete('/:quizId', [
  quizMiddleware.getQuiz,
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
  quizMiddleware.isOwner
], quizCtrl.deleteQuiz);

module.exports = router;
