const general = require('../routes/general.js');
const users = require('../components/user/user.router.js');
const missions = require('../components/mission/mission.router');
const quizzes = require('../components/quiz/quiz.router.js');
const groups = require('../components/group/group.router');
const groupMember = require('../components/groupMember/groupMember.router');
const post = require('../components/post/post.router.js');
const reaction = require('../components/reaction/reaction.router.js');
const appointment = require('../components/appointment/appointment.router.js');
const appointmentRequest = require('../components/appointmentRequest/appointmentRequest.router.js');
const places = require('../components/place/place.router');
const analytics = require('../routes/analytics');

module.exports = app => {
  app.use('/general', general);
  app.use('/users', users);
  app.use('/missions', missions);
  app.use('/quizzes', quizzes);
  app.use('/groups', groups);
  app.use('/group_members', groupMember);
  app.use('/posts', post);
  app.use('/reactions', reaction);
  app.use('/appointment', appointment);
  app.use('/appointment_requests', appointmentRequest);
  app.use('/places', places);
  app.use('/analytics', analytics);
};
