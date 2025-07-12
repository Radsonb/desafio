const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

productSchema.index({ company_id: 1 });

module.exports = mongoose.model('products', productSchema);