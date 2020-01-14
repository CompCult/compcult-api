const express = require('express');
const router = express.Router({ mergeParams: true });

const memoryAnswerCtrl = require('./memoryAnswer.controller');
const userMiddleware = require('../../../user/user.middlewares');

router.get('/', userMiddleware.authorize(), memoryAnswerCtrl.listMemoryAnswers);

router.post('/', [
  userMiddleware.authorize()
], memoryAnswerCtrl.createMemoryAnswer);

module.exports = router;
