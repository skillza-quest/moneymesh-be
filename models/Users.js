const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0UserId: { type: String, unique: true },
  username: String,
  email: String,
  roles: [String]
});

module.exports = mongoose.model('User', userSchema);
