const { Router } = require('express');
const oauth2orize = require('oauth2orize');
const { Client } = require('../../models/client');
const { Token } = require('../../models/token');
const { AuthorizationCode } = require('../../models/authorization-code');
const { ensureAuthenticated, checkClientAuthentication } = require('../../authentication');

const oauth2Controller = Router();
const oauth2AuthorizeRoute = oauth2Controller.route('/authorize');
const oauth2TokenRoute = oauth2Controller.route('/token');

const server = oauth2orize.createServer();

/* eslint-disable no-underscore-dangle */
server.serializeClient((client, callback) => callback(null, client._id));

server.deserializeClient(async (id, callback) => {
  try {
    const client = await Client.findOne({ _id: id });
    callback(null, client);
  } catch (err) {
    callback(err);
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators, max-len
}

function uid(len) {
  const buf = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charlen = chars.length;
  for (let i = 0; i < len; ++i) { // eslint-disable-line no-plusplus
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  return buf.join('');
}

server.grant(oauth2orize.grant.code(async (client, redirectUri, user, ares, callback) => {
  const code = new AuthorizationCode({
    value: uid(16),
    clientId: client._id,
    redirectUri,
    userId: user._id,
  });
  try {
    await code.save();
    callback(null, code.value);
  } catch (err) {
    callback(err);
  }
}));

server.exchange(oauth2orize.exchange.code(async (client, code, redirectUri, callback) => {
  try {
    const authCode = await AuthorizationCode.findOne({ value: code });
    if (!authCode) {
      return callback({ message: 'invalid code.' });
    }
    if (client._id.toString() !== authCode.clientId) {
      return callback({ message: 'client_id mismatched.' });
    }
    if (redirectUri !== authCode.redirectUri) {
      return callback({ message: 'redirect_uri mismatched.' });
    }
    await authCode.remove();
    const token = new Token({
      value: uid(256),
      clientId: authCode.clientId,
      userId: authCode.userId,
    });
    await token.save();
    return callback(null, token);
  } catch (err) {
    return callback(err, false);
  }
}));

const authorizationHandler = server.authorization(async (clientId, redirectUri, callback) => {
  try {
    const client = await Client.findOne({ id: clientId });
    if (!client) {
      return callback('Unidentified client_id ');
    }
    return callback(null, client, redirectUri);
  } catch (err) {
    return callback(err);
  }
});

const authorizationDialog = (req, res) => {
  res.render('oauth2/dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
};

oauth2TokenRoute.post(checkClientAuthentication, server.token(), server.errorHandler());
oauth2AuthorizeRoute.get(ensureAuthenticated, authorizationHandler, authorizationDialog);
oauth2AuthorizeRoute.post(ensureAuthenticated, server.decision());

exports.oauth2Controller = oauth2Controller;
