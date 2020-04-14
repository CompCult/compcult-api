const { StoreOrder, orderStatus } = require('./storeOrder.model');
const { User, userTypes } = require('../user/user.model');
const StoreItem = require('../storeItem/storeItem.model');
const _ = require('lodash');

exports.listOrders = async (req, res) => {
  let query = { _item: req.item.id };

  if (Object.keys(req.query).includes('status')) {
    query.status = req.query['status'];
  }

  const orders = await StoreOrder.find(query)
    .populate({ path: '_user', select: 'name' });

  return res.send(orders);
};

exports.createOrder = async (req, res) => {
  const order = new StoreOrder(req.body);
  order._user = req.user.id;
  order._item = req.item.id;

  const user = await User.findById(req.user.id);

  if (user.resources < req.item.value * order.quantity)
    return res.status(409).send('Insufficient user resources');

  if (req.item.isCreatedByMission) {

    if (req.item._user == req.user.id)
      return res.status(409).send('User owns the item!');

    const buyer = await User.findById(req.user.id);
    const owner = await User.findById(req.item._user);

    buyer.resources -= req.item.value * order.quantity;
    owner.resources += req.item.value * order.quantity;

    req.item.quantity += order.quantity;
    req.item.users.push(buyer.id);

    await buyer.save();
    await owner.save();
    await req.item.save();
    res.status(200).send();

  } else {

    if (req.item.users.includes(req.user.id))
      return res.status(409).send('User has already purchased this item!');

    if (req.item.quantity * order.quantity <= 0)
      return res.status(409).send('Insufficient item quantity!');



    user.resources -= req.item.value * order.quantity;
    req.item.quantity -= order.quantity;
    req.item.users.push(user.id);

    await order.save();
    await user.save();
    await req.item.save();
    res.send(order);

  }

};

exports.updateOrder = async (req, res) => {


  if (req.body.status && req.order.status == orderStatus.REJECTED)
    return res.status(409).send('Cannot change a rejected order');

  if (req.body.status == orderStatus.REJECTED) {

    const item = await StoreItem.findById(req.order._item);
    item.set({ 'quantity': item.quantity + req.order.quantity });
    item.users.pull(req.order._user);
    await item.save();

    const user = await User.findById(req.order._user);
    user.resources += item.value * req.order.quantity;
    await user.save();
  }
  req.order.set(req.body);
  await req.order.save();

  res.send(req.order);
};

exports.deleteOrder = async (req, res) => {
  req.item.quantity += req.order.quantity;
  req.item.users.pull(req.order._user);
  await req.item.save();

  const user = await User.findById(req.order._user);
  user.resources += req.item.value * req.order.quantity;
  await user.save();

  await req.order.delete();
  res.send(req.order);
};
