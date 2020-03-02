const StoreItem = require('./storeItem.model');
const _ = require('lodash');
const mongoose = require('mongoose');

exports.listItems = async (req, res) => {
  let query = _.omit(req.query, ['active']);

  if (Object.keys(req.query).includes('active')) {
    
    if (Number(req.query.active)) {
      query.start_time = { '$lte': new Date() };
      query.$or = [{ end_time: null }, { end_time: { '$gte': new Date() } }];
    } else {
      query.$or = [
        { start_time: { '$gt': Date.now() } },
        { end_time: { '$lt': Date.now() } }
      ];
    } 
  }

  const items = await StoreItem.find(query);
  res.send(items);
};

exports.getItem = (req, res) => {
  res.send(req.item);
};

exports.createItem = async (req, res) => {

  if(!req.body.value) return res.status(400).send('Value is a required field!');
  
  const item = new StoreItem(req.body);
  item._user = req.user.id;

  await item.save();
  res.send(item);
};

exports.updateItem = async (req, res) => {
  req.item.set(req.body);
  await req.item.save();

  res.send(req.item);
};

exports.deleteItem = async (req, res) => {
  await req.item.delete();
  res.send(req.item);
};
