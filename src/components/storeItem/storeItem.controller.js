const StoreItem = require('./storeItem.model');
const _ = require('lodash');
const mongoose = require('mongoose');
var Uploads = require('../../upload.js');
const config = require('config');

exports.listItems = async (req, res) => {
  let query = _.omit(req.query, ['active', 'purchased', 'owner']);

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

  if (Object.keys(req.query).includes('purchased')) {
    const userId = mongoose.Types.ObjectId(req.user.id);
    if (Number(req.query.purchased)) {
      query.users = { '$all': [userId] };
    } else {
      query.users = { '$not':{'$all': [userId] }};
    }
  }

  if (Object.keys(req.query).includes('owner')) {
    query._user = Number(req.query.owner) ? req.user.id : {'$ne': req.user.id};
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
  if (req.body.image) {
    const date = new Date();
    const timeStamp = date.toLocaleString();
    filename = req.user.id + timeStamp + '.jpg';

    Uploads.uploadFile(req.body.image, req.user.id, timeStamp);
    item.image = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  };

  await item.save();
  res.send(item);
};

exports.updateItem = async (req, res) => {
  req.item.set(req.body);
  if (req.body.image) {
    const date = new Date();
    const timeStamp = date.toLocaleString();
    filename = req.user.id + timeStamp + '.jpg';

    Uploads.uploadFile(req.body.image, req.user.id, timeStamp);
    item.image = 'https://s3.amazonaws.com/compcult/' + config.get('S3_FOLDER') + filename;
  };
  await req.item.save();

  res.send(req.item);
};

exports.deleteItem = async (req, res) => {
  await req.item.delete();
  res.send(req.item);
};
