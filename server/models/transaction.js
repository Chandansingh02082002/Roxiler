const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  sold: { type: Boolean, required: true },
  dateOfSale: { type: Date, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);
