const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
});

exports.Token = mongoose.model('Token', TokenSchema);
