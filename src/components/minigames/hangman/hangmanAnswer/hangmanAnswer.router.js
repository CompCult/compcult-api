const express = require('express');
const router = express.Router({ mergeParams: true });

const hangmanAnswerCtrl = require('./hangmanAnswer.controller');
const userMiddleware = require('../../../user/user.middlewares');

router.get('/', userMiddleware.authorize(), hangmanAnswerCtrl.listHangmanAnswers);

router.post('/', [
  userMiddleware.authorize()
], hangmanAnswerCtrl.createHangmanAnswer);

module.exports = router;
