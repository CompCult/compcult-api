var express = require('express');
var router = express.Router();

var Quiz = require('../models/quiz.js');
var QuizAnswer = require('../models/quiz_answer.js');
const tryCatch = require('../middlewares/awaitHandler');

router.get('/quiz/:quizId', tryCatch(async (req, res) => {
  const alternativesAmount = await QuizAnswer
    .aggregate([
      { $match: { _quiz: Number(req.params.quizId) } },
      { $group: { _id: '$answer', amount: { $sum: 1 } } }
    ]);

  const data = ['a', 'b', 'c', 'd', 'e'].map(alternative => {
    const alt = alternativesAmount.find(alt => alt._id === alternative);
    if (alt) return alt.amount;
    else return 0;
  });

  res.send([{ data }]);
}));

module.exports = router;
