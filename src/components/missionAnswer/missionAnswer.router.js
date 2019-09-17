var express = require('express');
var router = express.Router({ mergeParams: true });

const missionAnswerCtrl = require('./missionAnswer.controller');
const missionAnswerMiddleware = require('./missionAnswer.middlewares');

router.get('/', missionAnswerCtrl.listMissionAnswers);

router.get('/:missionAnswerId', [
  missionAnswerMiddleware.getMissionAnswer
], missionAnswerCtrl.getMissionAnswer);

router.get('/query/fields', missionAnswerCtrl.findMissionAnswerByParams);

router.post('/', missionAnswerCtrl.createMissionAnswer);

router.put('/:mission_id', missionAnswerCtrl.updateMissionAnswer);

router.delete('/:mission_id', missionAnswerCtrl.deleteMissionAnswer);

router.get('/missions', missionAnswerCtrl.findMissionFromMissionAnswer);

module.exports = router;
