const express = require('express');
const router = express.Router();

const userMiddleware = require('../../user/user.middlewares');
const hangmanMiddleware = require('./hangman.middlewares');
const userModel = require('../../user/user.model');
const hangmanCtrl = require('./hangman.controller');
const hangmanAnswerRouter = require('./hangmanAnswer/hangmanAnswer.router');

router.use('/:hangmanId/answers', hangmanAnswerRouter);

router.get('/', userMiddleware.authorize(), hangmanCtrl.listHangmans);

router.get('/:hangmanId', [
  hangmanMiddleware.getHangman
], hangmanCtrl.getHangman);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER, true)
], hangmanCtrl.createHangman);

router.put('/:hangmanId', [
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
  hangmanMiddleware.getHangman
], hangmanCtrl.updateHangman);

router.delete('/:hangmanId', [
  hangmanMiddleware.getHangman,
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
  hangmanMiddleware.isOwner
], hangmanCtrl.deleteHangman);

module.exports = router;
