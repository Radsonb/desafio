const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  fantasy_name: {
    type: String,
    required: true,
    maxlength: 30
  },
  razao_social: {
    type: String,
    required: true,
    maxlength: 50
  },
  cnpj: {
    type: String,
    required: true,
    unique: true,
    maxlength: 18
  }
}, {
  timestamps: true
});

companySchema.index({ user_id: 1 });

module.exports = mongoose.model('companies', companySchema);