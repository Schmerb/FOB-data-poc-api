/**
 * ResetToken Model
 *
 *
 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const { Types } = mongoose.Schema;

const ResetTokenSchema = mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isActive: { type: Boolean, default: true },
  requestingIP: { type: String, default: null },
});

ResetTokenSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    tokenId: this.tokenId,
    email: this.email,
    isActive: this.isActive,
    requestingIP: this.requestingIP || null,
    // _id is an ObjectID which has the createdAt timestamp encoded into first four bytes
    createdAt: this._id.getTimestamp(),
    updatedAt: this.updatedAt,
  };
};

const ResetToken = mongoose.model('ResetToken', ResetTokenSchema);

exports.ResetToken = ResetToken;
module.exports = ResetToken;
