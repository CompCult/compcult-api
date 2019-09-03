var Quiz = require('./quiz.model');
var QuizAnswer = require('../quizAnswer/quizAnswer.model');

const api = module.exports;

api.listQuizzes = function (req, res) {
  Quiz.find({}, function (err, quizzes) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(quizzes);
    }
  });
};

api.getQuiz = function (req, res) {
  Quiz.find({ _id: req.params.quiz_id }, function (err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(quiz);
    }
  });
};

api.findPublicQuizzes = function (req, res) {
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
};

api.findPrivateQuiz = function (req, res) {
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
};

api.findQuizzByParams = function (req, res) {
  Quiz.find(req.query, function (err, quiz) {
    if (err) {
      res.status(400).send(err);
    } else if (!quiz) {
      res.status(404).send('Quiz não encontrado');
    } else {
      res.status(200).json(quiz);
    }
  });
};

api.createQuizz = async (req, res) => {
  var quiz = new Quiz(req.body);
  quiz._user = req.user.id;
  quiz.secret_code = generateSecretCode();

  let startTime = new Date(req.body.start_time);
  let endTime = new Date(req.body.end_time);
  startTime.setHours(23, 59, 0);
  endTime.setHours(23, 59, 0);

  await quiz.save();
  res.send(quiz);
};

api.updateQuiz = async (req, res) => {
  const quiz = req.quiz;

  quiz.set(req.body);

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

  await quiz.save();
  res.send(quiz);
};

api.deleteQuiz = async (req, res) => {
  const quiz = req.quiz;
  await quiz.delete();

  res.send(quiz);
};

async function wasQuizAnswered (quiz, user) {
  const answers = await QuizAnswer.find({ _quiz: quiz, _user: user }).exec();
  return answers.length > 0;
};

function generateSecretCode () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

  return text;
};
