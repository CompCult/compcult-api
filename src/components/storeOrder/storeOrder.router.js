const express = require('express');
const router = express.Router();

const userMiddleware = require('../user/user.middlewares');
const userModel = require('../user/user.model');
const storeOrderCtrl = require('./storeOrder.controller');
const storeOrderMiddleware = require('./storeOrder.middlewares');

router.get('/', userMiddleware.authorize(), storeOrderCtrl.listOrders);

router.post('/', [
  userMiddleware.authorize()
], storeOrderCtrl.createOrder);

router.put('/:orderId', [
  storeOrderMiddleware.getOrder,
  userMiddleware.authorize(userModel.userTypes.TEACHER),
], storeOrderCtrl.updateOrder);

router.delete('/:orderId', [
  storeOrderMiddleware.getOrder,
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
], storeOrderCtrl.deleteOrder);

module.exports = router;
