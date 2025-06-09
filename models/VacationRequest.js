const mongoose = require('mongoose');

const vacationRequestSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  days_requested: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false
  },
  approval_date: {
    type: Date,
    required: false
  },
  denial_reason_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DenialReason',
    required: false
  },
  denial_comments: {
    type: String,
    trim: true
  },
  denial_date: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Index for better query performance
vacationRequestSchema.index({ employee_id: 1, start_date: 1 });
vacationRequestSchema.index({ status: 1 });

module.exports = mongoose.model('VacationRequest', vacationRequestSchema);