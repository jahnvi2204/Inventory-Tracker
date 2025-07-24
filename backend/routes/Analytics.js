// routes/analytics.js - Fixed with dashboard stats endpoint
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAuthenticated } = require('../middleware/auth');

const PYTHON_API = 'http://localhost:5001';

// Add debugging middleware
router.use((req, res, next) => {
  console.log('=== ANALYTICS ROUTE DEBUG ===');
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

// Dashboard summary data
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    console.log('✅ Analytics dashboard route - Authentication passed');
    
    const response = await axios.get(`${PYTHON_API}/api/analytics/dashboard`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    
    console.log('✅ Analytics dashboard - Python API response received');
    res.json(response.data);
  } catch (err) {
    console.error('❌ Analytics dashboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics', details: err.message });
  }
});

// Add /summary route for frontend compatibility
router.get('/summary', isAuthenticated, async (req, res) => {
  try {
    console.log('✅ Analytics summary route - Authentication passed');
    
    const response = await axios.get(`${PYTHON_API}/api/analytics/dashboard`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    
    console.log('✅ Analytics summary - Python API response received');
    res.json(response.data);
  } catch (err) {
    console.error('❌ Analytics summary error:', err.message);
    res.status(500).json({ error: 'Failed to fetch summary analytics', details: err.message });
  }
});

// NEW: Add /stats route that frontend is trying to access
router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    console.log('✅ Analytics stats route - Authentication passed');
    
    // Try to get data from Python API first
    try {
      const response = await axios.get(`${PYTHON_API}/api/analytics/dashboard`, { 
        params: req.query,
        headers: {
          'X-User-ID': req.user._id,
          'X-Organization': req.user.organization
        }
      });
      
      console.log('✅ Analytics stats - Python API response received');
      res.json(response.data);
    } catch (pythonApiError) {
      console.warn('⚠️ Python API not available, using fallback data');
      
      // Fallback: Return mock dashboard stats
      const mockStats = {
        success: true,
        data: {
          stats: {
            totalProducts: 0,
            lowStockProducts: 0,
            expiringProducts: 0,
            totalValue: 0
          },
          recentActivity: [],
          message: 'Dashboard stats - Python API unavailable, using fallback data'
        }
      };
      
      res.json(mockStats);
    }
  } catch (err) {
    console.error('❌ Analytics stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
});

// Inventory value analytics
router.get('/value', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/api/analytics/value`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory value analytics', details: err.message });
  }
});

// Stock level trends
router.get('/trends', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/api/analytics/trends`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock level trends', details: err.message });
  }
});

// Comprehensive inventory report
router.get('/reports/inventory', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_API}/reports/inventory`, { 
      params: req.query,
      headers: {
        'X-User-ID': req.user._id,
        'X-Organization': req.user.organization
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory report', details: err.message });
  }
});

module.exports = router;