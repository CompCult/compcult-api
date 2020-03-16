const {StoreOrder} = require('./storeOrder.model');

exports.getOrder = async (req, res, next) => {
  const order = await StoreOrder.findById(req.params.orderId);
  if (!order) return res.status(404).send('Order not found');

  req.order = order;
  next();
};