const express = require('express');
const router = express.Router();
const userMiddleware = require('../user/user.middlewares');
const userModel = require('../user/user.model');
const missionCtrl = require('./mission.controller');

router.get('/', missionCtrl.listMissions);

router.get('/:missionId', missionCtrl.getMission);

router.get('/query/fields', missionCtrl.findMissionByParams);

router.get('/public', missionCtrl.findPublicMissions);

router.get('/private', missionCtrl.findPrivateMission);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER)
], missionCtrl.createMission);

router.put('/:mission_id', missionCtrl.updateMission);

router.delete('/:mission_id', missionCtrl.deleteMission);

module.exports = router;
