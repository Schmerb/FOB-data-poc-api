const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const { Types } = mongoose.Schema;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  reportID: {
    type: String,
    default: '',
  },
  groupID: {
    type: String,
    default: '',
  },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    email: this.email || '',
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    phoneNumber: this.phoneNumber || '',
    reportID: this.reportID || '',
    groupID: this.groupID || '',
    isAdmin: this.isAdmin,
    // _id is an ObjectID which has the createdAt timestamp encoded into first four bytes
    createdAt: this._id.getTimestamp(),
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

exports.User = User;
module.exports = User;
