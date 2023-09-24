// models/Company.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new mongoose.Schema({
  name: String,
  industry: String,
  founded: Date,
  address: String,
  website: String,
  valuation: Number,
  status: String,
  employees: Number,
  revenue: Number,
  description: String,
  people: [{ type: Schema.Types.ObjectId, ref: 'People' }]  // Added this line
});

module.exports = mongoose.model('Company', companySchema);
