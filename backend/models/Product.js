// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    unique: true
  },
  barcode: {
    type: String,
    unique: true
  },
  category: String,
  quantity: {
    type: Number,
    default: 0
  },
  unit: String,
  price: Number,
  expiryDate: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  alerts: {
    lowStock: { type: Boolean, default: false },
    nearExpiry: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for days until expiry
ProductSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if product is low on stock
ProductSchema.methods.isLowStock = function(minQuantity = 5) {
  return this.quantity <= minQuantity;
};

// Method to check if product is near expiry
ProductSchema.methods.isNearExpiry = function(daysThreshold = 30) {
  if (!this.expiryDate) return false;
  const daysUntilExpiry = this.daysUntilExpiry;
  return daysUntilExpiry !== null && daysUntilExpiry <= daysThreshold && daysUntilExpiry > 0;
};

// Method to check if product is expired
ProductSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
};

// Pre-save hook to update alerts
ProductSchema.pre('save', function(next) {
  this.alerts = {
    lowStock: this.isLowStock(),
    nearExpiry: this.isNearExpiry()
  };
  if (this.quantity === 0) {
    this.status = 'archived';
  } else if (this.status === 'archived' && this.quantity > 0) {
    this.status = 'active';
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);