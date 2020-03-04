const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const orderStatus = {
  'APPROVED': 'aprovado',
  'REJECTED': 'rejeitado',
  'PENDING':'pendente'
};

const StoreOrderSchema = new Schema({
  _user: {
    type: ObjectId,
    ref: 'User'
  },
  _item: {
    type: ObjectId,
    ref: 'StoreItem'
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.PENDING
  },
  quantity: {
    type: Number,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const StoreOrder = mongoose.model('StoreOrder', StoreOrderSchema);

module.exports = {StoreOrder, orderStatus}