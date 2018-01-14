const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const { Strategy: BearerStrategy } = require('passport-http-bearer');
const { User } = require('./models/user');
const { Client } = require('./models/client');
const { Token } = require('./models/token');

passport.use(new BasicStrategy(async (username, password, callback) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return callback(null, false);
    }
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return callback(null, false);
    }
    return callback(null, user);
  } catch (err) {
    return callback(err, false);
  }
}));

passport.use('client-basic', new BasicStrategy(async (username, password, callback) => {
  try {
    const client = await Client.findOne({ id: username });
    if (!client || client.secret !== password) {
      return callback(null, false);
    }
    return callback(null, client);
  } catch (err) {
    return callback(err, false);
  }
}));

passport.use(new BearerStrategy(async (accessToken, callback) => {
  try {
    const token = await Token.findOne({ value: accessToken });
    if (!token) {
      return callback(null, false);
    }
    const user = await User.findOne({ _id: token.userId });
    if (!user) {
      return callback(null, false);
    }
    return callback(null, user, { scope: '*' });
  } catch (err) {
    return callback(err, false);
  }
}));

exports.ensureAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
exports.checkClientAuthentication = passport.authenticate('client-basic', { session: false });
exports.checkBearerAuthentication = passport.authenticate('bearer', { session: false });
