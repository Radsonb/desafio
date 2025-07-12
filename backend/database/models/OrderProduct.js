const mongoose = require('mongoose');

const orderProductSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit_price: {
    type: Number,
    required: true,
    min: 0
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

orderProductSchema.index({ order_id: 1, product_id: 1 }, { unique: true });
orderProductSchema.index({ order_id: 1 });
orderProductSchema.index({ product_id: 1 });

orderProductSchema.pre('save', function(next) {
  this.total_price = this.quantity * this.unit_price;
  next();
});

module.exports = mongoose.model('order_products', orderProductSchema);