// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Google OAuth routes
router.get('/google',
  (req, res, next) => { console.log('GET /api/auth/google'); next(); },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  (req, res, next) => { console.log('GET /api/auth/google/callback'); next(); },
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Successful authentication
    const user = req.user;
    await user.updateLastLogin();
    
    // Redirect to frontend with success
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// Get current user
router.get('/me', (req, res, next) => { console.log('GET /api/auth/me'); next(); }, isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
      role: req.user.role,
      organization: req.user.organization,
      preferences: req.user.preferences
    }
  });
});

// Update user preferences
router.put('/preferences', (req, res, next) => { console.log('PUT /api/auth/preferences'); next(); }, isAuthenticated, async (req, res) => {
  try {
    const { theme, notifications } = req.body;
    
    if (theme) {
      req.user.preferences.theme = theme;
    }
    
    if (notifications) {
      req.user.preferences.notifications = {
        ...req.user.preferences.notifications,
        ...notifications
      };
    }
    
    await req.user.save();
    
    res.json({
      success: true,
      preferences: req.user.preferences
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Logout
router.post('/logout', (req, res, next) => { console.log('POST /api/auth/logout'); next(); }, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to destroy session'
        });
      }
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });
});

module.exports = router;