// models/Founder.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const peopleSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model('People', peopleSchema);
