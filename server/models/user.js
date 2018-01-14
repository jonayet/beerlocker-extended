const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function beforeSave(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  const salt = bcrypt.genSaltSync(5);
  const passwordHash = bcrypt.hashSync(user.password, salt, null);
  user.password = passwordHash;
  return next();
});

UserSchema.methods.verifyPassword = async function verifyPassword(value) {
  const isMatch = bcrypt.compareSync(value, this.password);
  return Promise.resolve(isMatch);
};

exports.User = mongoose.model('User', UserSchema);
