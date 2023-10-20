const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    eventType: String,
    notes: String,
    status: String,
  });

  module.exports = mongoose.model('Event', EventSchema);
