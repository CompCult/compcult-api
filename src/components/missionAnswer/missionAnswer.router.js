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

router.post('/', [
  authorize()
], missionAnswerCtrl.createMissionAnswer);

router.put('/:missionAnswerId', [
  authorize()
], missionAnswerCtrl.updateMissionAnswer);

router.delete('/:missionAnswerId', [
  authorize()
], missionAnswerCtrl.deleteMissionAnswer);

module.exports = router;
