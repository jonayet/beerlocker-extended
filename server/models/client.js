const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true },
  secret: { type: String, required: true },
  userId: { type: String, required: true },
});

exports.Client = mongoose.model('Client', ClientSchema);
