const express = require('express');
const router = express.Router({ mergeParams: true });

const missionAnswerCtrl = require('./missionAnswer.controller');
const missionAnswerMiddleware = require('./missionAnswer.middlewares');
const { authorize } = require('../user/user.middlewares');

router.get('/', [
  authorize()
], missionAnswerCtrl.listMissionAnswers);

router.get('/:missionAnswerId', [
  authorize(),
  missionAnswerMiddleware.getMissionAnswer
], missionAnswerCtrl.getMissionAnswer);

router.get('/query/fields', [
  authorize()
], missionAnswerCtrl.findMissionAnswerByParams);

router.post('/', [
  authorize()
], missionAnswerCtrl.createMissionAnswer);

router.put('/:mission_id', [
  authorize()
], missionAnswerCtrl.updateMissionAnswer);

router.delete('/:mission_id', [
  authorize()
], missionAnswerCtrl.deleteMissionAnswer);

router.get('/missions', [
  authorize()
], missionAnswerCtrl.findMissionFromMissionAnswer);

module.exports = router;
