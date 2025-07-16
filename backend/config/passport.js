// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Organization = require('../models/Organization');

console.log('=== PASSPORT CONFIG LOADING ===');
console.log('GOOGLE_CLIENT_ID available:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET available:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('GOOGLE_CLIENT_ID value:', process.env.GOOGLE_CLIENT_ID);

// Validate environment variables before proceeding
if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'placeholder') {
  console.error('❌ GOOGLE_CLIENT_ID is missing or set to placeholder');
  throw new Error('GOOGLE_CLIENT_ID environment variable is required and cannot be "placeholder"');
}

if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET === 'placeholder') {
  console.error('❌ GOOGLE_CLIENT_SECRET is missing or set to placeholder');
  throw new Error('GOOGLE_CLIENT_SECRET environment variable is required and cannot be "placeholder"');
}

module.exports = function(passport) {
  console.log('=== CONFIGURING PASSPORT ===');
  
  passport.serializeUser((user, done) => {
    console.log('=== SERIALIZE USER ===');
    console.log('Serializing user ID:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('=== DESERIALIZE USER ===');
    console.log('Deserializing user ID:', id);
    
    try {
      const user = await User.findById(id);
      console.log('Found user:', user ? user.email : 'Not found');
      done(null, user);
    } catch (err) {
      console.error('Deserialize error:', err);
      done(err, null);
    }
  });

  console.log('Creating Google Strategy with:', {
    clientID: process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  });

  // Google OAuth strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('=== GOOGLE STRATEGY CALLBACK ===');
    console.log('Profile received:', {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName
    });
    
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        console.log('User not found, creating new user...');
        
        // Find or create the default organization
        let defaultOrg = await Organization.findOne({ name: 'DefaultOrg' });
        if (!defaultOrg) {
          console.log('Creating default organization...');
          defaultOrg = await Organization.create({ name: 'DefaultOrg' });
        }
        
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          organization: defaultOrg._id,
          role: 'staff',
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              sms: false
            }
          }
        });
        
        console.log('New user created:', user.email);
      } else {
        console.log('Existing user found:', user.email);
        
        // Update last login
        if (typeof user.updateLastLogin === 'function') {
          try {
            await user.updateLastLogin();
          } catch (updateError) {
            console.error('Failed to update last login:', updateError);
          }
        } else {
          // Manually update lastLogin if method doesn't exist
          user.lastLogin = new Date();
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google strategy error:', error);
      return done(error, null);
    }
  }));
  
  console.log('=== PASSPORT CONFIGURED SUCCESSFULLY ===');
};