import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Link,
  Fade,
  Slide,
  CircularProgress,
  Alert,
  Tooltip,
  Avatar,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
} from '@mui/material';
import {
  Google,
  Visibility,
  VisibilityOff,
  Email,
  Lock,

  Security,
  Speed,

  Star,
  WorkspacePremium,
  Shield,
  TrendingUp,
  People,
  Verified,
  LightMode,
  DarkMode,
 
} from '@mui/icons-material';
import { ThemeProvider, createTheme, keyframes } from '@mui/material/styles';
import { checkAuthStatus } from '../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading, error: authError } = useSelector((state) => state.auth || {});
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('google');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [darkMode, setDarkMode] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);
  const [error, setError] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#db2777',
      },
      background: {
        default: darkMode ? '#0f0f23' : '#f8fafc',
        paper: darkMode ? '#1a1a2e' : '#ffffff',
      },
      success: { main: '#10b981' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 16 },
  });

  // Animations
  const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  `;

  const glow = keyframes`
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
  `;

  // Check for auth errors in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'no_user':
          setError('Authentication completed but no user data received.');
          break;
        case 'callback_failed':
          setError('Authentication callback failed. Please try again.');
          break;
        default:
          setError('Authentication error occurred.');
      }
      
      // Clean up URL
      const newUrl = location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location]);

  // Check authentication status ONCE on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
    // Only run once on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      return;
    } else {
      console.log('❌ User is not authenticated');
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      dispatch({ type: 'AUTH_CLEAR' });
    }

    // Animate elements sequentially
    const timeouts = [
      setTimeout(() => setAnimationStep(1), 200),
      setTimeout(() => setAnimationStep(2), 400),
      setTimeout(() => setAnimationStep(3), 600),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [isAuthenticated, navigate, location]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clear any existing errors
      const returnTo = location.state?.from?.pathname || '/dashboard';
      
      // Redirect to Google OAuth with return URL
      window.location.href = `http://localhost:5000/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to initiate Google login');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Email login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Operations Manager',
      company: 'TechFlow Inc.',
      text: 'Zero Inventory saved us 40% on operational costs',
      avatar: 'SC',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CEO',
      company: 'RetailPro',
      text: 'Best inventory management decision we ever made',
      avatar: 'MR',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Warehouse Director',
      company: 'Global Logistics',
      text: 'Streamlined our entire supply chain process',
      avatar: 'EW',
      rating: 5
    }
  ];

  const features = [
    { icon: <Speed />, text: 'Setup in 5 minutes' },
    { icon: <Security />, text: 'Bank-level security' },
    { icon: <People />, text: '50K+ happy users' },
    { icon: <TrendingUp />, text: '40% cost reduction' }
  ];

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: darkMode 
            ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode 
            ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: { xs: 60, md: 120 },
            height: { xs: 60, md: 120 },
            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
            borderRadius: '50%',
            opacity: 0.1,
            animation: `${float} 8s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: { xs: 40, md: 80 },
            height: { xs: 40, md: 80 },
            background: 'linear-gradient(45deg, #10b981, #f59e0b)',
            borderRadius: '50%',
            opacity: 0.1,
            animation: `${float} 6s ease-in-out infinite reverse`,
          }}
        />

        {/* Theme Toggle */}
        <Tooltip title="Toggle Theme" placement="left">
          <IconButton
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#6366f1' }
            }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            display: 'flex',
            maxWidth: 1200,
            width: '100%',
            gap: 4,
            alignItems: 'center',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {/* Left Side - Branding & Features */}
          <Fade in={animationStep >= 1} timeout={800}>
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', lg: 'block' },
                pr: 4,
              }}
            >
              {/* Logo & Branding */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WorkspacePremium 
                    sx={{ 
                      fontSize: 48, 
                      color: '#6366f1', 
                      mr: 2,
                      animation: `${glow} 3s ease-in-out infinite`
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: '#fff',
                        background: 'linear-gradient(45deg, #fff 30%, #6366f1 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Zero Inventory
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Professional Edition
                    </Typography>
                  </Box>
                </Box>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    mb: 4,
                    lineHeight: 1.4
                  }}
                >
                  Transform your business with AI-powered inventory management
                </Typography>

                {/* Features Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 6 }}>
                  {features.map((feature, index) => (
                    <Slide 
                      key={index}
                      direction="right" 
                      in={animationStep >= 2} 
                      timeout={600 + index * 100}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#6366f1'
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography 
                          variant="body1" 
                          sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    </Slide>
                  ))}
                </Box>
              </Box>

              {/* Testimonials Carousel */}
              <Fade in={animationStep >= 3} timeout={1000}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#fff', 
                      mb: 3, 
                      fontWeight: 600 
                    }}
                  >
                    Trusted by Industry Leaders
                  </Typography>
                  
                  <Stack spacing={2}>
                    {testimonials.slice(0, 2).map((testimonial, index) => (
                      <Card
                        key={index}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: '#6366f1', 
                                mr: 2,
                                width: 40,
                                height: 40,
                                fontWeight: 600
                              }}
                            >
                              {testimonial.avatar}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {testimonial.name}
                              </Typography>
                              <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                                {testimonial.role} • {testimonial.company}
                              </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto', display: 'flex' }}>
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} sx={{ color: '#f59e0b', fontSize: 16 }} />
                              ))}
                            </Box>
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontStyle: 'italic'
                            }}
                          >
                            "{testimonial.text}"
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Fade>
            </Box>
          </Fade>

          {/* Right Side - Login Form */}
          <Slide direction="left" in={animationStep >= 1} timeout={1000}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 4, sm: 6 },
                maxWidth: 480,
                width: '100%',
                background: darkMode 
                  ? 'rgba(26, 26, 46, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Error Alert */}
              {(error || authError) && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError(null)}
                >
                  {error || authError}
                </Alert>
              )}

              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <WorkspacePremium sx={{ fontSize: 40, color: '#6366f1', mr: 1 }} />
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800, 
                      color: 'text.primary' 
                    }}
                  >
                    Welcome Back
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 2
                  }}
                >
                  Sign in to access your inventory dashboard
                </Typography>

                {/* Trust Indicators */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Shield />}
                    label="SOC 2 Certified"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Verified />}
                    label="99.9% Uptime"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Login Methods Toggle */}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: 2,
                    p: 0.5
                  }}
                >
                  <Button
                    fullWidth
                    variant={loginMethod === 'google' ? 'contained' : 'text'}
                    onClick={() => setLoginMethod('google')}
                    sx={{
                      py: 1,
                      fontWeight: 600,
                      ...(loginMethod === 'google' && {
                        background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                      })
                    }}
                  >
                    Quick Sign In
                  </Button>
                  <Button
                    fullWidth
                    variant={loginMethod === 'email' ? 'contained' : 'text'}
                    onClick={() => setLoginMethod('email')}
                    sx={{
                      py: 1,
                      fontWeight: 600,
                      ...(loginMethod === 'email' && {
                        background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                      })
                    }}
                  >
                    Email Sign In
                  </Button>
                </Box>
              </Box>

              {/* Google Login */}
              {loginMethod === 'google' && (
                <Fade in timeout={500}>
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<Google />}
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                        color: '#fff',
                        fontWeight: 700,
                        py: 2,
                        mb: 3,
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          background: 'rgba(99, 102, 241, 0.5)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Signing in...
                        </>
                      ) : (
                        'Continue with Google'
                      )}
                    </Button>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Secure OAuth authentication
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* Email Login Form */}
              {loginMethod === 'email' && (
                <Fade in timeout={500}>
                  <Box component="form" onSubmit={handleEmailLogin}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      required
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      required
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                        color: '#fff',
                        fontWeight: 700,
                        py: 2,
                        mb: 3,
                        fontSize: '1.1rem',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Link
                        href="#"
                        sx={{
                          color: '#6366f1',
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Forgot your password?
                      </Link>
                    </Box>

                    <Divider sx={{ my: 3 }}>
                      <Typography variant="caption" color="text.secondary">
                        OR
                      </Typography>
                    </Divider>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Google />}
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          borderColor: '#6366f1',
                          background: 'rgba(99, 102, 241, 0.1)'
                        }
                      }}
                    >
                      Continue with Google
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Footer Links */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    sx={{
                      color: '#6366f1',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign up for free
                  </Link>
                </Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  By signing in, you agree to our{' '}
                  <Link href="#" sx={{ color: '#6366f1' }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" sx={{ color: '#6366f1' }}>Privacy Policy</Link>
                </Typography>
              </Box>

              {/* Security Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: '16px 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Shield sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={600}>
                  Secure
                </Typography>
              </Box>
            </Paper>
          </Slide>
        </Box>

        {/* Mobile Features (visible only on mobile) */}
        {isMobile && (
          <Fade in={animationStep >= 2} timeout={800}>
            <Box sx={{ mt: 4, width: '100%', maxWidth: 480 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#fff', 
                  mb: 2, 
                  textAlign: 'center',
                  fontWeight: 600 
                }}
              >
                Why Choose Zero Inventory?
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      p: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ color: '#6366f1', mb: 1 }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontWeight: 600,
                        display: 'block'
                      }}
                    >
                      {feature.text}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Login;