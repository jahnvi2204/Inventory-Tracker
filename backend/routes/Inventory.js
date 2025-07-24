// routes/inventory.js - Fixed to use session auth
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const { isAuthenticated, hasRole } = require('../middleware/auth'); // ✅ Use session auth
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const axios = require('axios');

const PYTHON_API = 'http://localhost:5001';

// Add debugging middleware
router.use((req, res, next) => {
  console.log('=== INVENTORY ROUTE DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user ? {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role
  } : 'No user');
  next();
});

// Alerts & Monitoring
router.get('/alerts/low-stock', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/api/alerts/low-stock`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch low stock alerts', details: err.message });
  }
});

router.get('/alerts/expiring', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/api/alerts/expiring`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expiring products', details: err.message });
  }
});

router.get('/alerts/expired', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/api/alerts/expired`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expired products', details: err.message });
  }
});

// System
router.post('/refresh', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API}/refresh`, req.body, {
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh data', details: err.message });
  }
});

router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/health`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get system health', details: err.message });
  }
});

// Categories
router.get('/categories', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/categories`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

router.get('/categories/:id/products', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/categories/${req.params.id}/products`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products in category', details: err.message });
  }
});

// Proxy for /api/inventory/products to match /api/products  
router.get('/products', isAuthenticated, async (req, res) => {
  try {
    console.log('✅ Inventory products route - Authentication passed');
    
    const response = await axios.get(`${PYTHON_API}/api/products`, {
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    
    console.log('✅ Inventory products - Python API response received');
    res.json(response.data);
  } catch (err) {
    console.error('❌ Inventory products error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

module.exports = router;