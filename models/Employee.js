const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: false
  },
  role: {
    type: String,
    enum: ['employee', 'supervisor', 'administrator'],
    default: 'employee'
  },
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false
  }
}, {
  timestamps: true
});

// Virtual for full name
employeeSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

// Ensure virtual fields are serialized
employeeSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Employee', employeeSchema);