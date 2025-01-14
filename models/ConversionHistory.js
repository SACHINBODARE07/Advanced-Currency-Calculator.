const mongoose = require('mongoose');

const ConversionHistorySchema = new mongoose.Schema({
  sourceCurrency: String,
  sourceAmount: Number,
  targetCurrency: String,
  targetAmount: Number,
  date: { type: Date, default: Date.now },
  rateSource: { type: String, default: 'European Central Bank' },
  notes: String,
});

module.exports = mongoose.model('ConversionHistory', ConversionHistorySchema);

