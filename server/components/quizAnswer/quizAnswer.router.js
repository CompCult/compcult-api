var express = require('express');
var router = express.Router();

const quizAnswerCtrl = require('./quizAnswer.controller');

router.get('/', quizAnswerCtrl.listQuizAnswers);

router.get('/:answer_id', quizAnswerCtrl.getQuizAnswer);

router.get('/query/fields', quizAnswerCtrl.findQuizAnswerByParams);

router.post('/', quizAnswerCtrl.createQuizAnswer);

router.put('/:answer_id', quizAnswerCtrl.updateQuizAnswer);

router.delete('/:quizAnswer_id', quizAnswerCtrl.deleteQuizAnswer);

module.exports = router;
