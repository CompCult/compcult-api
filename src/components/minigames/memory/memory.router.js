const express = require('express');
const router = express.Router();

const userMiddleware = require('../../user/user.middlewares');
const memoryMiddleware = require('./memory.middlewares');
const userModel = require('../../user/user.model');
const memoryCtrl = require('./memory.controller');
// const memoryAnswerRouter = require('../memoryAnswer/memoryAnswer.router');

// router.use('/:memoryId/answers', memoryAnswerRouter);

// router.get('/', userMiddleware.authorize(), memoryCtrl.listMemories);

// router.get('/:memoryId', [
//   memoryMiddleware.getMemory
// ], memoryCtrl.getMemory);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER)
], memoryCtrl.createMemory);

router.delete('/:memoryId', [
  memoryMiddleware.getMemory,
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  memoryMiddleware.isOwner
], memoryCtrl.deleteMemory);

module.exports = router;
