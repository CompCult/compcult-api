const express = require('express');
const userMiddleware = require('../../user/user.middlewares');
const userModel = require('../../user/user.model');
const controller = require('./simulation.controller');
const middlewares = require('./simulation.middlewares');

const router = express.Router();

router.get('/', userMiddleware.authorize(userModel.userTypes.TEACHER), controller.getAll);

router.get('/:simulationId', [
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  middlewares.getSimulation
], controller.get);

router.post('/', userMiddleware.authorize(userModel.userTypes.TEACHER), controller.create);

router.put('/:simulationId', [
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  middlewares.getSimulation
], controller.update);

router.delete('/:simulationId', [
  userMiddleware.authorize(userModel.userTypes.TEACHER),
  middlewares.getSimulation
], controller.remove);

module.exports = router;
