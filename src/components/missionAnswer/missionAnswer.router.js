var express = require('express');
var router = express.Router();

const missionAnswerCtrl = require('./missionAnswer.controller');

router.get('/', missionAnswerCtrl.listMissionAnswers);

router.get('/:answer_id', missionAnswerCtrl.getMissionAnswer);

router.get('/query/fields', missionAnswerCtrl.findMissionAnswerByParams);

router.post('/', missionAnswerCtrl.createMissionAnswer);

router.put('/:mission_id', missionAnswerCtrl.updateMissionAnswer);

router.delete('/:mission_id', missionAnswerCtrl.deleteMissionAnswer);

router.get('/missions', missionAnswerCtrl.findMissionFromMissionAnswer);

module.exports = router;
