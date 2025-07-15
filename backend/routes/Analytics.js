const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const { isAuthenticated } = require('../middleware/auth');

// Get inventory summary stats
router.get('/summary', (req, res, next) => { console.log('GET /api/analytics/summary'); next(); }, isAuthenticated, async (req, res) => {
  try {
    const organization = req.user.organization;
    const totalProducts = await Product.countDocuments({ organization });
    const totalQuantity = await Product.aggregate([
      { $match: { organization } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const lowStock = await Product.countDocuments({ organization, 'alerts.lowStock': true });
    const nearExpiry = await Product.countDocuments({ organization, 'alerts.nearExpiry': true });
    res.json({
      success: true,
      data: {
        totalProducts,
        totalQuantity: totalQuantity[0]?.total || 0,
        lowStock,
        nearExpiry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch summary', error: error.message });
  }
});

// Get product trends (additions/removals over time)
router.get('/trends', isAuthenticated, async (req, res) => {
  try {
    const organization = req.user.organization;
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const trends = await InventoryTransaction.aggregate([
      { $match: { organization, createdAt: { $gte: since } } },
      { $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          type: '$type'
        },
        total: { $sum: '$quantity' }
      } },
      { $sort: { '_id.day': 1 } }
    ]);
    res.json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trends', error: error.message });
  }
});

// Get list of low stock products
router.get('/low-stock', isAuthenticated, async (req, res) => {
  try {
    const organization = req.user.organization;
    const products = await Product.find({ organization, 'alerts.lowStock': true });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch low stock products', error: error.message });
  }
});

// Get list of near expiry products
router.get('/near-expiry', isAuthenticated, async (req, res) => {
  try {
    const organization = req.user.organization;
    const products = await Product.find({ organization, 'alerts.nearExpiry': true });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch near expiry products', error: error.message });
  }
});

module.exports = router; 