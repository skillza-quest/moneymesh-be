const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
  creatorId: { type: String },
  name: { type: String, required: true },
  type: { type: String, required: true },
  website: String,
  linkedInProfile: String,
  avgInvestmentAmount: Number,
  totalInvestmentsMade: Number,
  investedCompanies: [String],
  investmentStage: String,
  industryFocus: [String],
  geographicFocus: String,
  fundSize: String,
  exitHistory: [String],
  primaryContactName: String,
  primaryContactPosition: String,
  contactEmail: String,
  contactPhone: Number,
  rating: Number,
  reviews: [String],
  tags: [String],
  timeToDecision: String,
  notes: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investor', InvestorSchema);
