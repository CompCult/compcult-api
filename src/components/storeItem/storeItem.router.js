const express = require('express');
const router = express.Router();

const userMiddleware = require('../user/user.middlewares');
const userModel = require('../user/user.model');
const storeCtrl = require('./storeItem.controller');
const storeMiddleware = require('./storeItem.middlewares');
const orderRoutes = require('../storeOrder/storeOrder.router');

router.use('/:itemId/orders', storeMiddleware.getItem, orderRoutes);

router.get('/', userMiddleware.authorize(), storeCtrl.listItems);

router.get('/:itemId', [
  storeMiddleware.getItem
], storeCtrl.getItem);

router.post('/', [
  userMiddleware.authorize(userModel.userTypes.TEACHER, true)
], storeCtrl.createItem);

router.put('/:itemId', [
  storeMiddleware.getItem,
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
  storeMiddleware.isOwner
], storeCtrl.updateItem);

router.delete('/:itemId', [
  storeMiddleware.getItem,
  userMiddleware.authorize(userModel.userTypes.TEACHER, true),
  storeMiddleware.isOwner
], storeCtrl.deleteItem);

module.exports = router;
