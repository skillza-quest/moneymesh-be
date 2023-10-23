const mongoose = require('mongoose');

const InviteTokenSchema = new mongoose.Schema({
  token: String,
  mandateId: mongoose.Schema.Types.ObjectId,
  expires: Date,
  consumed: Boolean,
});

const InviteToken = mongoose.model('InviteToken', InviteTokenSchema);

module.exports = InviteToken;