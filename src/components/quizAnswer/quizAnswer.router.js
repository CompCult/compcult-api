const express = require('express');
const router = express.Router({ mergeParams: true });

const quizAnswerCtrl = require('./quizAnswer.controller');
const userModel = require('../user/user.model');
const quizAnswerMiddleware = require('./quizAnswer.middlewares');
const userMiddleware = require('../user/user.middlewares');

router.get('/', userMiddleware.authorize(), quizAnswerCtrl.listQuizAnswers);

router.get('/:quizAnswerId', userMiddleware.authorize(), quizAnswerCtrl.getQuizAnswer);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.STUDENT)
], quizAnswerCtrl.createQuizAnswer);

router.put('/:quizAnswerId', [
  userMiddleware.authorize(),
  quizAnswerMiddleware.getQuizAnswer
], quizAnswerCtrl.updateQuizAnswer);

router.delete('/:quizAnswerId', [
  userMiddleware.authorize(),
  quizAnswerMiddleware.getQuizAnswer
], quizAnswerCtrl.deleteQuizAnswer);

module.exports = router;
