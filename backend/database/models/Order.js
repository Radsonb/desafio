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
  products: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  total_value: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

orderSchema.index({ company_id: 1 });

orderSchema.pre('save', async function(next) {
  if (this.products && this.products.length > 0) {
    try {
      const Product = mongoose.model('products');
      let total = 0;

      for (const item of this.products) {
        const product = await Product.findById(item.product_id);
        if (product) {
          total += product.value * item.quantity;
        }
      }

      this.total_value = total;
      next();
    } catch (error) {
      next(error);      
    }
  } else {
    next();
  }
})