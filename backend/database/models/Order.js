const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clients',
    required: true
  },
  order_number: {
    type: Number,
    required: true
  },
  order_date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 200
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  total_value: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

orderSchema.index({ company_id: 1 });
orderSchema.index({ client_id: 1 });
orderSchema.index({ order_number: 1, company_id: 1 }, { unique: true });

module.exports = mongoose.model('orders', orderSchema);