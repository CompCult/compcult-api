var express = require('express');
var router = express.Router();

var User = require('../user/user.model.js');
var Quiz = require('../quiz/quiz.model.js');
var QuizAnswer = require('./quizAnswer.model.js');

// Index
router.get('/', function (req, res) {
  QuizAnswer.find({}, function (err, answers) {
    if (err) {
      res.status(400).send(err);
    } else {
      let promises;

      try {
        promises = answers.map(injectData);
      } catch (err) {
        res.status(400).send(err);
      }

      Promise.all(promises).then(function (results) {
        res.status(200).json(results);
      });
    }
  });
});

// Show
router.get('/:answer_id', function (req, res) {
  QuizAnswer.find({ _id: req.params.answer_id }, function (err, answer) {
    if (err) {
      res.status(400).send(err);
    } else if (!answer) {
      res.status(404).send('Resposta não encontrada');
    } else {
      let answerComplete = injectData(answer);

      res.status(200).send(answerComplete);
    }
  });
});

var injectData = async function (answer) {
  let string = JSON.stringify(answer);
  let answerComplete = JSON.parse(string);

  let userObj = await User.findById(answer._user).exec();
  let quizObj = await Quiz.findById(answer._quiz).exec();

  answerComplete._user = userObj;
  answerComplete._quiz = quizObj;

  return answerComplete;
};

// Find by params
router.get('/query/fields', function (req, res) {
  QuizAnswer.find(req.query, function (err, answers) {
    if (err) {
      res.status(400).send(err);
    } else if (!answers) {
      res.status(404).send('Resposta do quiz não encontrada');
    } else {
      try {
        const promises = answers.map(injectData);

        Promise.all(promises).then(function (results) {
          res.status(200).json(results);
        });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  });
});

// Create
router.post('/', async function (req, res) {
  var quizAnswer = new QuizAnswer();
  quizAnswer._user = req.body._user;
  quizAnswer._quiz = req.body._quiz;
  quizAnswer.answer = req.body.answer;
  const approved = await verifyAnswer(quizAnswer._quiz, quizAnswer.answer);

  if (approved !== undefined) {
    quizAnswer.approved = approved;
  }

  quizAnswer.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(quizAnswer);
    }
  });
});

var verifyAnswer = async function (quizId, answer) {
  let quiz = await Quiz.findById(quizId).exec();

  if (quiz.correct_answer && quiz.correct_answer === answer) {
    recompenseUser(answer._user, quiz.points);
    return true;
  } else if (quiz.correct_answer && quiz.correct_answer !== answer.answer) {
    return false;
  }
};

var recompenseUser = function (userId, points) {
  User.findById(userId, function (err, user) {
    if (err) throw err;

    if (user) {
      user.points += points;
      user.save(function (err) {
        if (err) throw err;

        console.log('Usuário recompensado');
      });
    }
  });
};

// Update
router.put('/:answer_id', function (req, res) {
  QuizAnswer.findById(req.params.answer_id, function (err, quizAnswer) {
    if (err) throw err;

    if (req.body._user) quizAnswer._user = req.body._user;
    if (req.body._quiz) quizAnswer._quiz = req.body._quiz;
    if (req.body.answer) quizAnswer.answer = req.body.answer;
    if (req.body.approved !== undefined) {
      quizAnswer.approved = req.body.approved;

      if (req.body.approved) {
        Quiz.findById(quizAnswer._quiz, function (err, q) {
          if (err) throw err;

          if (q) {
            recompenseUser(quizAnswer._user, q.points);
          }
        });
      }
    }

    quizAnswer.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(quizAnswer);
      }
    });
  });
});

// Delete
router.delete('/:quizAnswer_id', function (req, res) {
  QuizAnswer.remove({ _id: req.params.quizAnswer_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Resposta removida.');
    }
  });
});

module.exports = router;
