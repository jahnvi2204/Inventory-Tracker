const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: String,
  contactEmail: String,
  contactPhone: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  settings: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('Organization', OrganizationSchema); 