const general = require('../routes/general.js');
const users = require('../components/user/user.router.js');
const missions = require('../components/mission/mission.router');
const missionsAnswer = require('../components/missionAnswer/missionAnswer.router');
const quizzes = require('../routes/quiz.js');
const quizzesAnswer = require('../routes/quizAnswer.js');
const groups = require('../components/group/group.router');
const groupMember = require('../components/groupMember/groupMember.router');
const post = require('../routes/post.js');
const reaction = require('../routes/reaction.js');
const appointment = require('../routes/appointment.js');
const appointmentRequest = require('../routes/appointmentRequest.js');
const places = require('../routes/place.js');
const analytics = require('../routes/analytics');

module.exports = app => {
  app.use('/general', general);
  app.use('/users', users);
  app.use('/missions', missions);
  app.use('/missions_answers', missionsAnswer);
  app.use('/quizzes', quizzes);
  app.use('/quiz_answers', quizzesAnswer);
  app.use('/groups', groups);
  app.use('/group_members', groupMember);
  app.use('/posts', post);
  app.use('/reactions', reaction);
  app.use('/appointment', appointment);
  app.use('/appointment_requests', appointmentRequest);
  app.use('/places', places);
  app.use('/analytics', analytics);
};
