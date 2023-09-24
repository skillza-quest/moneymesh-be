const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const investorSchema = new mongoose.Schema({
  investorId: String,
  name: String,
  type: String,
  website: String,
  linkedInProfile: String,
  avgInvestmentAmount: Number,
  totalInvestmentsMade: Number,
  investedCompanies: [String],
  investmentStage: String,
  industries: [String],
  geographicFocus: String,
  fundSize: Number,
  exitHistory: [String],
  primaryContactPerson: {
    name: String,
    position: String
  },
  contactEmail: String,
  contactPhone: String,
  rating: Number,
  reviews: [String],
  tags: [String],
  timeToDecision: String,
  dueDiligenceRequirements: [String],
  notes: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
  people: [{ type: Schema.Types.ObjectId, ref: 'People' }],
  portfolioCompanies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  lastUpdated: Date
});

module.exports = mongoose.model('Investor', investorSchema);
