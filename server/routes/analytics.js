var express = require('express');
var router = express.Router();

var QuizAnswer = require('../components/quizAnswer/quizAnswer.model.js');

router.get('/quiz/:quizId', async (req, res) => {
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
});

module.exports = router;
