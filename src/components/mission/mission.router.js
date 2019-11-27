const express = require('express');
const router = express.Router();
const userMiddleware = require('../user/user.middlewares');
const userModel = require('../user/user.model');
const missionCtrl = require('./mission.controller');
const missionMiddlewares = require('./mission.middlewares');
const missionAnswerRouter = require('../missionAnswer/missionAnswer.router');

router.use('/:missionId/answers', userMiddleware.authorize(), missionAnswerRouter);

router.get('/', userMiddleware.authorize(), missionCtrl.listMissions);

router.get('/:missionId', missionCtrl.getMission);

router.get('/query/fields', missionCtrl.findMissionByParams);

router.get('/public', missionCtrl.findPublicMissions);

router.get('/private', missionCtrl.findPrivateMission);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER)
], missionCtrl.createMission);

router.put('/:missionId', [
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  missionMiddlewares.getMission,
  missionMiddlewares.isOwner
], missionCtrl.updateMission);

router.delete('/:missionId', [
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  missionMiddlewares.getMission,
  missionMiddlewares.isOwner
], missionCtrl.deleteMission);

module.exports = router;
