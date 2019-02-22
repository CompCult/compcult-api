var express = require('express');
var router = express.Router();

const quizCtrl = require('./quiz.controller');

router.get('/', quizCtrl.listQuizzes);

router.get('/public', quizCtrl.findPublicQuizzes);

router.get('/private', quizCtrl.findPrivateQuiz);

router.get('/query/fields', quizCtrl.findQuizzByParams);

router.post('/', quizCtrl.createQuizz);

router.put('/:quiz_id', quizCtrl.updateQuizz);

router.delete('/:quiz_id', quizCtrl.deleteQuiz);

router.get('/:quiz_id', quizCtrl.getQuiz);

module.exports = router;
