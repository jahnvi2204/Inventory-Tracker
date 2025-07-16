// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');

console.log('=== AUTH ROUTES LOADING ===');

// Google OAuth routes
router.get('/google',
  (req, res, next) => { 
    console.log('=== GOOGLE AUTH START ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Query params:', req.query);
    console.log('Session ID before auth:', req.sessionID);
    console.log('Session data before auth:', req.session);
    
    // Store the original URL if user was trying to access a protected route
    req.session.returnTo = req.query.returnTo || '/dashboard';
    console.log('Return URL set to:', req.session.returnTo);
    
    next(); 
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    // Ensure proper session handling
    session: true
  })
);

router.get('/google/callback',
  (req, res, next) => { 
    console.log('=== GOOGLE CALLBACK START ===');
    console.log('Callback URL:', req.originalUrl);
    console.log('Query params:', req.query);
    console.log('Session ID on callback:', req.sessionID);
    console.log('Session data on callback:', req.session);
    console.log('Is authenticated before passport:', req.isAuthenticated());
    
    next(); 
  },
  (req, res, next) => {
    console.log('=== PASSPORT AUTHENTICATE ===');
    passport.authenticate('google', { 
      failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
      session: true // Ensure session is maintained
    })(req, res, (err) => {
      console.log('Passport authenticate callback:');
      console.log('Error:', err);
      console.log('User after auth:', req.user);
      console.log('Is authenticated after passport:', req.isAuthenticated());
      console.log('Session after passport:', req.session);
      
      if (err) {
        console.error('Passport authentication error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=passport_error`);
      }
      
      next();
    });
  },
  async (req, res) => {
    console.log('=== FINAL CALLBACK HANDLER ===');
    
    try {
      console.log('User object:', JSON.stringify(req.user, null, 2));
      console.log('Session object:', JSON.stringify(req.session, null, 2));
      console.log('Is authenticated:', req.isAuthenticated());
      
      // Successful authentication
      const user = req.user;
      
      if (user) {
        console.log('User found, updating last login...');
        
        // Check if updateLastLogin method exists
        if (typeof user.updateLastLogin === 'function') {
          try {
            await user.updateLastLogin();
            console.log('Last login updated successfully');
          } catch (updateError) {
            console.error('Failed to update last login:', updateError);
            // Continue anyway, this shouldn't block login
          }
        } else {
          console.log('updateLastLogin method not found on user object');
        }
        
        // Get the return URL from session or default to dashboard
        const returnTo = req.session.returnTo || '/dashboard';
        console.log('Return URL from session:', req.session.returnTo);
        console.log('Final return URL:', returnTo);
        
        // Clean up return URL from session
        delete req.session.returnTo;
        
        const redirectUrl = `${process.env.CLIENT_URL}${returnTo}`;
        console.log('Full redirect URL:', redirectUrl);
        console.log('CLIENT_URL env var:', process.env.CLIENT_URL);
        
        // Save session and redirect
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            console.error('Session save error stack:', saveErr.stack);
          } else {
            console.log('Session saved successfully');
          }
          
          console.log('Final session state:', req.session);
          console.log('Redirecting to:', redirectUrl);
          
          // Redirect to frontend with success
          res.redirect(redirectUrl);
        });
      } else {
        console.error('=== NO USER FOUND ===');
        console.error('req.user is:', req.user);
        console.error('Session passport:', req.session.passport);
        res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
      }
    } catch (error) {
      console.error('=== CALLBACK ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=callback_failed`);
    }
  }
);

// Local registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    if (!name || !email || !password || !organization) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }
    // Find or create organization
    let org = await Organization.findOne({ name: organization });
    if (!org) {
      org = await Organization.create({ name: organization });
    }
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      organization: org._id,
      role: 'staff',
      preferences: { theme: 'light', notifications: { email: true, sms: false } }
    });
    // Log in user
    req.login(user, (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Login after registration failed.' });
      res.json({ success: true, user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        organization: user.organization,
        preferences: user.preferences
      }});
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Local login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    // Log in user
    req.login(user, (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Login failed.' });
      res.json({ success: true, user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        organization: user.organization,
        preferences: user.preferences
      }});
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper to format user info
function formatUser(user) {
  if (!user) return null;
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    organization: user.organization,
    preferences: user.preferences
  };
}

// Health check for auth status
router.get('/status', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: formatUser(req.user),
    success: true
  });
});

// Get current user
router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
    isAuthenticated: true
  });
});

// Update user preferences
router.put('/preferences', 
  (req, res, next) => { 
    console.log('=== UPDATE PREFERENCES ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    next(); 
  }, 
  isAuthenticated, 
  async (req, res) => {
    try {
      const { theme, notifications } = req.body;
      console.log('Updating preferences - theme:', theme, 'notifications:', notifications);
      
      if (theme) {
        req.user.preferences.theme = theme;
        console.log('Theme updated to:', theme);
      }
      
      if (notifications) {
        req.user.preferences.notifications = {
          ...req.user.preferences.notifications,
          ...notifications
        };
        console.log('Notifications updated to:', req.user.preferences.notifications);
      }
      
      const savedUser = await req.user.save();
      console.log('User preferences saved successfully');
      
      res.json({
        success: true,
        preferences: savedUser.preferences
      });
    } catch (error) {
      console.error('=== PREFERENCES UPDATE ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      res.status(400).json({
        success: false,
        message: 'Failed to update preferences',
        error: error.message
      });
    }
  }
);

// Logout
router.post('/logout', 
  (req, res, next) => { 
    console.log('=== LOGOUT REQUEST ===');
    console.log('Session ID:', req.sessionID);
    console.log('User:', req.user);
    console.log('Session before logout:', req.session);
    next(); 
  }, 
  (req, res) => {
    console.log('Starting logout process...');
    
    req.logout((err) => {
      if (err) {
        console.error('=== LOGOUT ERROR ===');
        console.error('Logout error:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({
          success: false,
          message: 'Logout failed'
        });
      }
      
      console.log('Logout successful, destroying session...');
      console.log('Session after logout:', req.session);
      
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error('=== SESSION DESTROY ERROR ===');
          console.error('Session destroy error:', destroyErr);
          console.error('Error stack:', destroyErr.stack);
          return res.status(500).json({
            success: false,
            message: 'Failed to destroy session'
          });
        }
        
        console.log('Session destroyed successfully');
        res.clearCookie('connect.sid'); // Clear the session cookie
        console.log('Session cookie cleared');
        
        res.json({
          success: true,
          message: 'Logged out successfully'
        });
      });
    });
  }
);

module.exports = router;