const express = require('express');
const router = express.Router({ mergeParams: true });

const quizAnswerCtrl = require('./quizAnswer.controller');
const quizAnswerMiddleware = require('./quizAnswer.middlewares');

router.get('/', quizAnswerCtrl.listQuizAnswers);

router.get('/:quizAnswerId', quizAnswerCtrl.getQuizAnswer);

router.post('/', quizAnswerCtrl.createQuizAnswer);

router.put('/:quizAnswerId', [
  quizAnswerMiddleware.getQuizAnswer
], quizAnswerCtrl.updateQuizAnswer);

router.delete('/:quizAnswerId', [
  quizAnswerMiddleware.getQuizAnswer
], quizAnswerCtrl.deleteQuizAnswer);

module.exports = router;
