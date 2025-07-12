const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'companies',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    maxlength: 50
  },
  phone: {
    type: String,
    maxlength: 15
  }
}, {
  timestamps: true
});

clientSchema.index({ company_id: 1 });

module.exports = mongoose.model('clients', clientSchema);