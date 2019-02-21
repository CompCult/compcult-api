var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
const config = require('config');

mongoose.Promise = global.Promise;
mongoose.connect(config.get('db'))
  .then(() => console.log(`Connected to ${config.get('db')}`));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

require('./startup/logger')(app);
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '100mb'
}));
app.use(cors());

app.get('/', function (req, res) {
  res.send('This API is running, baby!');
});

var general = require('./routes/general.js');
var users = require('./routes/user.js');
var missions = require('./routes/mission.js');
var missions_answer = require('./routes/mission_answer.js');
var quizzes = require('./routes/quiz.js');
var quizzes_answer = require('./routes/quiz_answer.js');
var groups = require('./routes/group.js');
var group_member = require('./routes/group_member.js');
var post = require('./routes/post.js');
var reaction = require('./routes/reaction.js');
var tree = require('./routes/tree.js');
var tree_request = require('./routes/tree_request.js');
var tree_type = require('./routes/tree_type.js');
var appointment = require('./routes/appointment.js');
var appointment_request = require('./routes/appointment_request.js');
var places = require('./routes/place.js');
var analytics = require('./routes/analytics');

app.use('/general', general);
app.use('/users', users);
app.use('/missions', missions);
app.use('/missions_answers', missions_answer);
app.use('/quizzes', quizzes);
app.use('/quiz_answers', quizzes_answer);
app.use('/groups', groups);
app.use('/group_members', group_member);
app.use('/posts', post);
app.use('/reactions', reaction);
app.use('/trees', tree);
app.use('/tree_requests', tree_request);
app.use('/tree_types', tree_type);
app.use('/appointment', appointment);
app.use('/appointment_requests', appointment_request);
app.use('/places', places);
app.use('/analytics', analytics);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  const status = err.status || 500;
  res.status(status).send({ 'message': err.message });
});

module.exports = app;
