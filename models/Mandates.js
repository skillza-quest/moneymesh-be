const mongoose = require('mongoose');
const EventSchema = require('../models/Events').schema;

const InvestorInMandateSchema = new mongoose.Schema({
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor' },
    mandateStatus: { type: String, default: 'new' }, 
    events: [EventSchema],
    notes: String,
});

const MandateSchema = new mongoose.Schema({
    mandateName: { type: String, required: true },  
    creatorId: { type: String, required: true },  
    investors: [InvestorInMandateSchema],
    collaboratorIds: [String],
}, { timestamps: true });

module.exports = mongoose.model('Mandate', MandateSchema);
