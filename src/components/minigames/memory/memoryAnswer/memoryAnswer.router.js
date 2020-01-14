const express = require('express');
const router = express.Router({ mergeParams: true });

const memoryAnswerCtrl = require('./memoryAnswer.controller');
// const memoryAnswerMiddleware = require('./quizAnswer.middlewares');
const userMiddleware = require('../../../user/user.middlewares');

// router.get('/', userMiddleware.authorize(), memoryAnswerCtrl.listQuizAnswers);

// router.get('/:quizAnswerId', userMiddleware.authorize(), memoryAnswerCtrl.getQuizAnswer);

router.post('/', [
  userMiddleware.authorize()
], memoryAnswerCtrl.createMemoryAnswer);

// router.delete('/:quizAnswerId', [
//   userMiddleware.authorize(),
//   memoryAnswerMiddleware.getQuizAnswer
// ], memoryAnswerCtrl.deleteQuizAnswer);

module.exports = router;
