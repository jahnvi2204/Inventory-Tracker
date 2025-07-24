// routes/Products.js - Fixed to use session auth instead of JWT
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAuthenticated } = require('../middleware/auth'); // ✅ Use session auth instead of JWT

const PYTHON_API = 'http://localhost:5001'; // Python service runs on 5001

// Add debugging middleware
router.use((req, res, next) => {
  console.log('=== PRODUCTS ROUTE DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('User:', req.user ? {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    organization: req.user.organization
  } : 'No user');
  console.log('Headers:', {
    'user-agent': req.headers['user-agent']?.substring(0, 50),
    'authorization': req.headers['authorization'] ? 'present' : 'missing'
  });
  next();
});

// List all products with filtering
router.get('/', isAuthenticated, async (req, res) => {
  try {
    console.log('✅ Products route - Authentication passed');
    console.log('Query params:', req.query);
    
    const response = await axios.get(`${PYTHON_API}/products`, {
      params: req.query,
      // Don't pass Authorization header since we're using sessions
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    
    console.log('✅ Python API response received');
    res.json(response.data);
  } catch (err) {
    console.error('❌ Products route error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// Create new product
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API}/products`, req.body, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Create product error:', err.message);
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// Get product details
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/products/${req.params.id}`, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Get product error:', err.message);
    res.status(500).json({ error: 'Failed to fetch product details', details: err.message });
  }
});

// Update product
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.put(`${PYTHON_API}/products/${req.params.id}`, req.body, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Update product error:', err.message);
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// Delete product
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.delete(`${PYTHON_API}/products/${req.params.id}`, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Delete product error:', err.message);
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

// Bulk import products
router.post('/bulk', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API}/products/bulk`, req.body, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Bulk import error:', err.message);
    res.status(500).json({ error: 'Failed to bulk import products', details: err.message });
  }
});

// Update stock quantity
router.put('/:id/stock', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.put(`${PYTHON_API}/products/${req.params.id}/stock`, req.body, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Update stock error:', err.message);
    res.status(500).json({ error: 'Failed to update stock', details: err.message });
  }
});

// Record stock movement
router.post('/:id/movement', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_API}/products/${req.params.id}/movement`, req.body, {
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Stock movement error:', err.message);
    res.status(500).json({ error: 'Failed to record stock movement', details: err.message });
  }
});

// Get stock movement history
router.get('/movements', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/movements`, {
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-User-Email': req.user.email,
        'X-User-Role': req.user.role,
        'X-Organization': req.user.organization
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Get movements error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stock movement history', details: err.message });
  }
});

module.exports = router;