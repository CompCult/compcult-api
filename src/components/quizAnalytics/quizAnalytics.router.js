const express = require('express');
const router = express.Router({ mergeParams: true });

const quizAnswerCtrl = require('./quizAnalytics.controller');

router.get('/', quizAnswerCtrl.calculateQuizAnswers);

module.exports = router;