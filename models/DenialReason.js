const mongoose = require('mongoose');

const denialReasonSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DenialReason', denialReasonSchema);