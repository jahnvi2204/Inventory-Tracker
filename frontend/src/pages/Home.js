import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  useScrollTrigger,
  Fab,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Rating,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  PlayArrow,
  Inventory,
  Analytics,
  QrCodeScanner,
  Speed,
  Security,
  Psychology,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowForward,
  KeyboardArrowUp,
  WorkspacePremium,
  AutoGraph,
  Timeline,
  People,
  CloudSync,
  Integration,
  Phone,
  Email,
  Launch,
  ExpandMore,
  Close,
  Menu,
  Lightbulb,
  Shield,
  Rocket,
  Diamond,
  FlashOn,
  Handshake,
  Support,
  Language,
  Schedule,
  Notifications,
  Assessment,
  Verified,
  EmojiEvents,
  Grade,
  Business,
  Code,
  Api,
  Storage,
  CloudQueue,
} from '@mui/icons-material';
import { ThemeProvider, createTheme, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    users: 0,
    companies: 0,
    items: 0,
    savings: 0
  });

  const { darkMode, toggleDarkMode } = useThemeMode();

const trigger = useScrollTrigger({
  disableHysteresis: true,
  threshold: 100,
  // Add target: undefined to prevent SSR issues
  target: typeof window !== 'undefined' ? window : undefined,
});

  // Animations
  const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  `;

  const glow = keyframes`
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
  `;

  const slideUp = keyframes`
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  `;

  // Animated counter effect
  useEffect(() => {
    const animateValue = (start, end, duration, key) => {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        setAnimatedNumbers(prev => ({ ...prev, [key]: value }));
        if (progress === 1) clearInterval(timer);
      }, 16);
    };

    if (typeof window !== 'undefined' && window.document) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateValue(0, 50000, 2000, 'users');
            animateValue(0, 5000, 2000, 'companies');
            animateValue(0, 10000000, 2000, 'items');
            animateValue(0, 25, 2000, 'savings');
          }
        });
      });

      const statsElement = document.getElementById('stats-section');
      if (statsElement) observer.observe(statsElement);

      return () => observer.disconnect();
    }
    return undefined;
  }, []);

  const features = [
    {
      icon: <Inventory />,
      title: 'Real-time Inventory',
      description: 'Track stock levels instantly with live updates and automated alerts',
      color: '#6366f1'
    },
    {
      icon: <Psychology />,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and predictive analytics',
      color: '#ec4899'
    },
    {
      icon: <QrCodeScanner />,
      title: 'Smart Barcode Scanner',
      description: 'Scan products with advanced recognition technology',
      color: '#10b981'
    },
    {
      icon: <AutoGraph />,
      title: 'Advanced Analytics',
      description: 'Comprehensive reports and business intelligence',
      color: '#f59e0b'
    },
    {
      icon: <People />,
      title: 'Team Collaboration',
      description: 'Multi-user access with role-based permissions',
      color: '#8b5cf6'
    },
    {
      icon: <Security />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance standards',
      color: '#06b6d4'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager',
      company: 'TechCorp Inc.',
      avatar: 'SJ',
      rating: 5,
      text: 'Zero Inventory transformed our operations. We reduced stockouts by 90% and improved efficiency dramatically.'
    },
    {
      name: 'Michael Chen',
      role: 'Warehouse Director',
      company: 'Global Logistics',
      avatar: 'MC',
      rating: 5,
      text: 'The AI insights are incredible. It predicts demand patterns we never could have seen manually.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'Retail Plus',
      avatar: 'ER',
      rating: 5,
      text: 'ROI was visible within the first month. The best inventory management decision we\'ve ever made.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for small businesses',
      features: [
        'Up to 1,000 products',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      color: 'primary'
    },
    {
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'For growing companies',
      features: [
        'Up to 10,000 products',
        'Advanced AI analytics',
        'Priority support',
        'API access',
        'Custom integrations'
      ],
      popular: true,
      color: 'secondary'
    },
    {
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For large organizations',
      features: [
        'Unlimited products',
        'White-label solution',
        '24/7 dedicated support',
        'Custom deployment',
        'Advanced security'
      ],
      popular: false,
      color: 'success'
    }
  ];

  const ScrollToTop = () => {
    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <Zoom in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <Fab color="primary" size="small">
            <KeyboardArrowUp />
          </Fab>
        </Box>
      </Zoom>
    );
  };

  const HeroSection = () => (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 120,
          height: 120,
          background: 'linear-gradient(45deg, #6366f1, #ec4899)',
          borderRadius: '50%',
          opacity: 0.1,
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 80,
          height: 80,
          background: 'linear-gradient(45deg, #10b981, #f59e0b)',
          borderRadius: '50%',
          opacity: 0.1,
          animation: `${float} 8s ease-in-out infinite reverse`,
        }}
      />

      {/* Enhanced Navigation */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: trigger ? 'rgba(15, 15, 35, 0.95)' : 'transparent',
          backdropFilter: trigger ? 'blur(20px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: trigger ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <WorkspacePremium sx={{ mr: 1, color: '#6366f1', fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
              Zero Inventory
            </Typography>
            <Chip 
              label="Pro" 
              size="small" 
              sx={{ 
                ml: 1, 
                background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                color: 'white',
                fontWeight: 600
              }} 
            />
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 3 }}>
            {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <Button
                key={item}
                color="inherit"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#6366f1',
                    background: 'rgba(99, 102, 241, 0.1)'
                  }
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              sx={{ 
                color: '#fff', 
                fontWeight: 600,
                display: { xs: 'none', sm: 'inline-flex' }
              }} 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)', 
                color: '#fff', 
                fontWeight: 700,
                px: 3,
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }} 
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
            
            {/* Mobile Menu */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Content */}
      <Container maxWidth="xl" sx={{ pt: { xs: 15, md: 20 }, pb: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                    color: '#fff',
                    mb: 3,
                    background: 'linear-gradient(45deg, #fff 30%, #6366f1 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `${slideUp} 1s ease-out`,
                  }}
                >
                  Smart Inventory Management Reimagined
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    mb: 4, 
                    lineHeight: 1.6,
                    animation: `${slideUp} 1s ease-out 0.2s both`,
                  }}
                >
                  Harness the power of AI, real-time analytics, and modern design 
                  to transform your inventory operations and boost efficiency by up to 40%.
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  mb: 6,
                  flexDirection: { xs: 'column', sm: 'row' },
                  animation: `${slideUp} 1s ease-out 0.4s both`,
                }}>
                  <Button
                    size="large"
                    variant="contained"
                    startIcon={<Rocket />}
                    sx={{
                      background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                      color: '#fff',
                      fontWeight: 700,
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                      '&:hover': {
                        boxShadow: '0 16px 50px rgba(99, 102, 241, 0.5)',
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Start Free Trial
                  </Button>
                  
                  <Button
                    size="large"
                    variant="outlined"
                    startIcon={<PlayArrow />}
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      fontWeight: 600,
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: '#6366f1',
                        background: 'rgba(99, 102, 241, 0.1)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setVideoDialogOpen(true)}
                  >
                    Watch Demo
                  </Button>
                </Box>

                {/* Trust Indicators */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4,
                  flexWrap: 'wrap',
                  animation: `${slideUp} 1s ease-out 0.6s both`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={5} readOnly size="small" />
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      4.9/5 from 1000+ reviews
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Shield sx={{ color: '#10b981' }} />
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      SOC 2 Certified
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Slide direction="left" in timeout={1200}>
              <Box sx={{ position: 'relative' }}>
                {/* Dashboard Preview */}
                <Paper
                  elevation={24}
                  sx={{
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    animation: `${glow} 4s ease-in-out infinite`,
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      📊 Live Dashboard Preview
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      {[
                        { label: 'Total Items', value: '12,847', color: '#6366f1' },
                        { label: 'Low Stock', value: '23', color: '#f59e0b' },
                        { label: 'Value', value: '$2.4M', color: '#10b981' }
                      ].map((metric, index) => (
                        <Card 
                          key={index} 
                          sx={{ 
                            flex: 1, 
                            background: 'rgba(255,255,255,0.1)',
                            border: `1px solid ${metric.color}40`
                          }}
                        >
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ color: metric.color, fontWeight: 700 }}>
                              {metric.value}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.7)">
                              {metric.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                    
                    {/* Simulated Chart */}
                    <Box sx={{ height: 100, background: 'rgba(99, 102, 241, 0.1)', borderRadius: 2, p: 2 }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        Real-time Analytics
                      </Typography>
                      {[...Array(8)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: 'inline-block',
                            width: '8%',
                            height: `${Math.random() * 60 + 20}px`,
                            background: '#6366f1',
                            mx: 0.5,
                            mt: 2,
                            borderRadius: '2px 2px 0 0',
                            animation: `${slideUp} 1s ease-out ${i * 0.1}s both`,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Feature List */}
                  <List dense>
                    {[
                      'AI-powered demand forecasting',
                      'Real-time stock alerts',
                      'Automated reorder points',
                      'Advanced analytics dashboard'
                    ].map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Floating Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(45deg, #ec4899, #f59e0b)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `${float} 3s ease-in-out infinite`,
                  }}
                >
                  <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
                </Box>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  const StatsSection = () => (
    <Box id="stats-section" sx={{ py: 10, background: 'rgba(255, 255, 255, 0.02)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} textAlign="center">
          {[
            { label: 'Happy Users', value: animatedNumbers.users, suffix: '+' },
            { label: 'Companies', value: animatedNumbers.companies, suffix: '+' },
            { label: 'Items Tracked', value: animatedNumbers.items, suffix: 'M+' },
            { label: 'Cost Savings', value: animatedNumbers.savings, suffix: '%' }
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#6366f1', 
                  fontWeight: 800, 
                  mb: 1 
                }}
              >
                {stat.value.toLocaleString()}{stat.suffix}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600
                }}
              >
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  const FeaturesSection = () => (
    <Box sx={{ py: 12, background: 'linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" sx={{ color: '#fff', mb: 2 }}>
            Powerful Features for Modern Business
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}>
            Everything you need to manage inventory efficiently, backed by cutting-edge technology
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${feature.color}30`,
                    border: `1px solid ${feature.color}50`,
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${feature.color}, ${feature.color}80)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3
                    }}
                  >
                    {React.cloneElement(feature.icon, { 
                      sx: { color: 'white', fontSize: 28 } 
                    })}
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  const TestimonialsSection = () => (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" sx={{ color: '#fff', mb: 2 }}>
            Loved by Thousands of Businesses
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            See what our customers are saying about Zero Inventory
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#6366f1', mr: 2, width: 56, height: 56 }}>
                    {testimonial.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {testimonial.role}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6366f1' }}>
                      {testimonial.company}
                    </Typography>
                  </Box>
                </Box>
                
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontStyle: 'italic',
                    lineHeight: 1.6
                  }}
                >
                  "{testimonial.text}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  const PricingSection = () => (
    <Box sx={{ py: 12, background: 'rgba(99, 102, 241, 0.05)' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" sx={{ color: '#fff', mb: 2 }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Choose the perfect plan for your business needs
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: plan.popular 
                    ? 'linear-gradient(145deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: plan.popular 
                    ? '2px solid #6366f1' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                  }
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                )}
                
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
                    {plan.name}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                    {plan.description}
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: '#fff', 
                        fontWeight: 800,
                        display: 'inline'
                      }}
                    >
                      ${plan.price}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'inline'
                      }}
                    >
                      /{plan.period}
                    </Typography>
                  </Box>
                  
                  <List sx={{ mb: 4 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          primaryTypographyProps={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.95rem'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    fullWidth
                    variant={plan.popular ? 'contained' : 'outlined'}
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      ...(plan.popular ? {
                        background: 'linear-gradient(45deg, #6366f1, #ec4899)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                        '&:hover': {
                          boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5)',
                        }
                      } : {
                        color: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: '#6366f1',
                          background: 'rgba(99, 102, 241, 0.1)'
                        }
                      })
                    }}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box textAlign="center" mt={6}>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </Typography>
          <Button 
            variant="text" 
            sx={{ color: '#6366f1', fontWeight: 600 }}
          >
            Compare all features →
          </Button>
        </Box>
      </Container>
    </Box>
  );

  const FAQSection = () => (
    <Box sx={{ py: 12 }}>
      <Container maxWidth="md">
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" sx={{ color: '#fff', mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Everything you need to know about Zero Inventory
          </Typography>
        </Box>

        {[
          {
            question: 'How quickly can I get started?',
            answer: 'You can be up and running in under 5 minutes. Our setup wizard guides you through importing your existing inventory data, and our team provides free onboarding support.'
          },
          {
            question: 'Is my data secure?',
            answer: 'Absolutely. We use bank-level encryption, are SOC 2 certified, and host your data in secure, redundant data centers. Your data is never shared with third parties.'
          },
          {
            question: 'Can I integrate with my existing systems?',
            answer: 'Yes! We offer integrations with popular platforms like Shopify, WooCommerce, QuickBooks, and many more. Our API also allows custom integrations.'
          },
          {
            question: 'What if I need help?',
            answer: 'Our support team is available 24/7 via chat, email, and phone. We also provide comprehensive documentation, video tutorials, and free training sessions.'
          },
          {
            question: 'Can I cancel anytime?',
            answer: 'Yes, you can cancel your subscription at any time. We offer monthly and annual plans with no long-term contracts or cancellation fees.'
          }
        ].map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              mb: 2,
              '&:before': { display: 'none' },
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px !important'
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#fff' }} />}>
              <Typography variant="h6" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );

  const CTASection = () => (
    <Box 
      sx={{ 
        py: 12, 
        background: 'linear-gradient(145deg, #6366f1, #ec4899)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)',
          backgroundSize: '50px 50px'
        }}
      />
      
      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#fff', 
            mb: 3, 
            fontWeight: 800 
          }}
        >
          Ready to Transform Your Inventory?
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            mb: 6,
            maxWidth: 500,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Join thousands of businesses already saving time and money with Zero Inventory. 
          Start your free trial today - no credit card required.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            size="large"
            variant="contained"
            startIcon={<Rocket />}
            sx={{
              background: '#fff',
              color: '#6366f1',
              fontWeight: 700,
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              '&:hover': {
                background: '#f8f9fa',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/signup')}
          >
            Start Free Trial
          </Button>
          
          <Button
            size="large"
            variant="outlined"
            startIcon={<Phone />}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 600,
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: '#fff',
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Schedule Demo
          </Button>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            mt: 4 
          }}
        >
          💳 No credit card required • 🔒 SOC 2 Certified • ⭐ 4.9/5 rated
        </Typography>
      </Container>
    </Box>
  );

  const Footer = () => (
    <Box sx={{ py: 8, background: '#0a0a0a', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WorkspacePremium sx={{ mr: 1, color: '#6366f1', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
                Zero Inventory
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, lineHeight: 1.6 }}>
              The most advanced inventory management platform for modern businesses. 
              Built with AI, designed for scale.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['twitter', 'linkedin', 'github'].map((social) => (
                <IconButton 
                  key={social}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#6366f1' }
                  }}
                >
                  <Launch />
                </IconButton>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {[
                {
                  title: 'Product',
                  links: ['Features', 'Pricing', 'Integrations', 'API', 'Security', 'Roadmap']
                },
                {
                  title: 'Company',
                  links: ['About', 'Blog', 'Careers', 'Press', 'Partners', 'Contact']
                },
                {
                  title: 'Resources',
                  links: ['Documentation', 'Help Center', 'Community', 'Webinars', 'Status', 'Terms']
                }
              ].map((section, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#fff', 
                      mb: 2, 
                      fontWeight: 600 
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={1}>
                    {section.links.map((link) => (
                      <Button
                        key={link}
                        variant="text"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          justifyContent: 'flex-start',
                          px: 0,
                          '&:hover': {
                            color: '#6366f1',
                            background: 'transparent'
                          }
                        }}
                      >
                        {link}
                      </Button>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            © 2024 Zero Inventory. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <Button
                key={link}
                variant="text"
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': { color: '#6366f1' }
                }}
              >
                {link}
              </Button>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );

  // Video Dialog Component
  const VideoDialog = () => (
    <Dialog
      open={videoDialogOpen}
      onClose={() => setVideoDialogOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Zero Inventory Demo
        </Typography>
        <IconButton onClick={() => setVideoDialogOpen(false)} sx={{ color: '#fff' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: '100%',
            height: 400,
            background: 'linear-gradient(45deg, #6366f1, #ec4899)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <PlayArrow sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h6">Demo Video Player</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Video content would be embedded here
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ bgcolor: darkMode ? 'background.default' : '#fafafa' }}>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <ScrollToTop />
      <VideoDialog />
    </Box>
  );
};

export default Home;