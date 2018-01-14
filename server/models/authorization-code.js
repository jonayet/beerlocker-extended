const mongoose = require('mongoose');

const AuthorizationCodeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
});

exports.AuthorizationCode = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);
