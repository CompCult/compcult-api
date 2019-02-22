var express = require('express');
var router = express.Router();

var Quiz = require('./quiz.model');
var QuizAnswer = require('../quizAnswer/quizAnswer.model');

// Index
router.get('/', function (req, res) {
  Quiz.find({}, function (err, quizzes) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(quizzes);
    }
  });
});

// public?user_id
router.get('/public', function (req, res) {
  Quiz.find({ is_public: true }, async function (err, quizzes) {
    if (err) {
      res.status(400).send(err);
    } else {
      var result = [];
      let date = new Date();

      for (var i = 0; i < quizzes.length; i++) {
        let quiz = quizzes[i];
        let endTime = new Date(quiz.end_time);
        endTime.setHours(23, 59, 0);
        let inTime = endTime.getTime() >= date.getTime();

        if (quiz.single_answer) {
          await wasQuizAnswered(quiz._id, req.query.user_id).then((answered) => {
            if (!answered && inTime) {
              result.push(quiz);
            }
          });
        } else if (!quiz.single_answer && inTime) {
          result.push(quiz);
        }
      }
    }

    res.status(200).send(result);
  });
});

// private?user_id&secret_code
router.get('/private', function (req, res) {
  Quiz.findOne({ secret_code: req.query.secret_code }, async function (err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else if (!quiz) {
      res.status(404).send('Quiz não encontrado');
    } else {
      let endTime = new Date(quiz.end_time);
      endTime.setHours(23, 59, 0);
      let date = new Date();
      let answered;

      try {
        answered = await wasQuizAnswered(quiz._id, req.query.user_id);
      } catch (err) {
        res.status(400).send(err);
      }

      if (endTime < date) {
        res.status(401).send('Quiz expirado');
      } else if (quiz.single_answer && answered) {
        res.status(401).send('Quiz já foi respondido');
      } else {
        res.status(200).json(quiz);
      }
    }
  });
});

var wasQuizAnswered = async function (quiz, user) {
  const answers = await QuizAnswer.find({ _quiz: quiz, _user: user }).exec();
  return answers.length > 0;
};

// Find by params
router.get('/query/fields', function (req, res) {
  Quiz.find(req.query, function (err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else if (!quiz) {
      res.status(404).send('Quiz não encontrado');
    } else {
      res.status(200).json(quiz);
    }
  });
});

// Create
router.post('/', function (req, res) {
  var quiz = new Quiz();
  quiz.title = req.body.title;
  quiz._user = req.body._user;
  quiz.description = req.body.description;
  quiz.points = req.body.points;
  quiz.secret_code = generateSecretCode();
  quiz.is_public = req.body.is_public;
  quiz.single_answer = req.body.single_answer;
  quiz.alternative_a = req.body.alternative_a;
  quiz.alternative_b = req.body.alternative_b;
  quiz.correct_answer = req.body.correct_answer;

  let startTime = new Date(req.body.start_time);
  let endTime = new Date(req.body.end_time);
  startTime.setHours(23, 59, 0);
  endTime.setHours(23, 59, 0);
  quiz.start_time = startTime;
  quiz.end_time = endTime;

  if (req.body.alternative_c) quiz.alternative_c = req.body.alternative_c;
  if (req.body.alternative_d) quiz.alternative_d = req.body.alternative_d;
  if (req.body.alternative_e) quiz.alternative_e = req.body.alternative_e;

  quiz.save(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(quiz.secret_code);
    }
  });
});

// Update
router.put('/:quiz_id', function (req, res) {
  Quiz.findById(req.params.quiz_id, function (err, quiz) {
    if (err) throw err;

    if (req.body.title) quiz.title = req.body.title;
    if (req.body.description) quiz.description = req.body.description;
    if (req.body.points) quiz.points = req.body.points;
    if (req.body.is_public !== undefined) quiz.is_public = req.body.is_public;
    if (req.body.single_answer !== undefined) quiz.single_answer = req.body.single_answer;
    if (req.body.alternative_a) quiz.alternative_a = req.body.alternative_a;
    if (req.body.alternative_b) quiz.alternative_b = req.body.alternative_b;
    if (req.body.correct_answer) quiz.correct_answer = req.body.correct_answer;
    if (req.body.start_time) {
      const startTime = new Date(req.body.start_time);
      startTime.setHours(23, 59, 0);
      quiz.start_time = startTime;
    }
    if (req.body.end_time) {
      const endTime = new Date(req.body.end_time);
      endTime.setHours(23, 59, 0);
      quiz.end_time = endTime;
    }
    if (req.body.alternative_c) quiz.alternative_c = req.body.alternative_c;
    if (req.body.alternative_d) quiz.alternative_d = req.body.alternative_d;
    if (req.body.alternative_e) quiz.alternative_e = req.body.alternative_e;

    quiz.save(function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(quiz);
      }
    });
  });
});

// Delete
router.delete('/:quiz_id', function (req, res) {
  Quiz.remove({ _id: req.params.quiz_id }, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('Quiz removido.');
    }
  });
});

// Show
router.get('/:quiz_id', function (req, res) {
  Quiz.find({ _id: req.params.quiz_id }, function (err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(quiz);
    }
  });
});

function generateSecretCode () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};

module.exports = router;
