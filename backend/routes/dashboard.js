// src/pages/Dashboard.js - Fixed Chart.js issues
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Button,
  Alert,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Inventory2,
  Warning,
  TrendingUp,
  TrendingDown,
  EventNote,
  AttachMoney,
  Refresh,
  Login,
  Google,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { checkAuthStatus, initiateGoogleLogin, logout } from '../store/slices/authSlice';
import api, { cancelAllRequests } from '../services/api';

// CRITICAL: Register ALL Chart.js components properly
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const mountedRef = useRef(true);
  const loadingRef = useRef(false);
  const lastLoadRef = useRef(0);
  const timeoutRef = useRef(null);
  
  // Chart refs to properly destroy charts on unmount
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  
  // Redux state selectors
  const { 
    user, 
    isAuthenticated, 
    loading: authLoading,
    error: authError,
    initialized 
  } = useSelector((state) => state.auth || {});
  
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [connectionIssue, setConnectionIssue] = useState(false);
  const [lastSuccessfulLoad, setLastSuccessfulLoad] = useState(null);

  // Cleanup on unmount - CRITICAL for Chart.js
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      loadingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Destroy all charts to prevent canvas reuse errors
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
      
      cancelAllRequests();
    };
  }, []);

  // Stable auth check with debouncing
  const checkAuth = useCallback(async () => {
    if (!mountedRef.current || authLoading || loadingRef.current) {
      return;
    }

    const now = Date.now();
    if (now - lastLoadRef.current < 2000) {
      return;
    }
    lastLoadRef.current = now;

    try {
      await dispatch(checkAuthStatus()).unwrap();
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }, [dispatch, authLoading]);

  // Initial auth check with delay
  useEffect(() => {
    if (!initialized && !authLoading) {
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          checkAuth();
        }
      }, 500);
    }
  }, [initialized, authLoading, checkAuth]);

  // Stable data loading
  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated || !mountedRef.current || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setRefreshing(true);
    setConnectionIssue(false);
    
    try {
      console.log('🔄 Loading dashboard data...');
      
      // Step 1: Verify session
      const authCheck = await api.get('/auth/status');
      if (!mountedRef.current) return;
      console.log('✅ Session verified');
      
      // Step 2: Try to load products with different possible endpoints
      let productsResponse;
      let productData = [];
      
      try {
        // First try the main products endpoint
        productsResponse = await api.get('/products', { 
          params: { limit: 50 }, // Get more products for better dashboard
          timeout: 15000
        });
        console.log('✅ Products endpoint response:', productsResponse.data);
        
        // Handle different response structures from your Python API
        if (productsResponse.data) {
          if (Array.isArray(productsResponse.data)) {
            productData = productsResponse.data;
          } else if (productsResponse.data.products) {
            productData = productsResponse.data.products;
          } else if (productsResponse.data.data) {
            productData = productsResponse.data.data;
          } else if (productsResponse.data.items) {
            productData = productsResponse.data.items;
          }
        }
        
        console.log('📦 Raw product data:', productData);
        
        // Transform the data to match expected format
        if (Array.isArray(productData) && productData.length > 0) {
          const transformedProducts = productData.map((product, index) => ({
            _id: product.id || product._id || index,
            name: product.Name || product.name || product.ProductName || `Product ${index + 1}`,
            quantity: parseInt(product.Quantity) || parseInt(product.quantity) || 0,
            minQuantity: parseInt(product.MinQuantity) || parseInt(product.minQuantity) || parseInt(product.min_quantity) || 10,
            price: {
              selling: parseFloat(product.Price) || parseFloat(product.price) || parseFloat(product.sellingPrice) || 0
            },
            totalValue: parseFloat(product.TotalValue) || parseFloat(product.total_value) || 0,
            category: product.Category || product.category || product.CategoryID || 'Unknown',
            barcode: product.Barcode || product.barcode || '',
            location: product.Location || product.location || '',
            status: product.Status || product.status || 'active',
            description: product.Description || product.description || '',
            expiryDate: product.ExpiryDate || product.expiry_date || product.expiryDate,
            lowStock: product.LowStock || product.low_stock || false,
            nearExpiry: product.NearExpiry || product.near_expiry || false,
            expired: product.Expired || product.expired || false,
            daysToExpiry: parseInt(product.DaysToExpiry) || parseInt(product.days_to_expiry) || null
          }));
          
          console.log('🔄 Transformed products:', transformedProducts.slice(0, 3));
          setProducts(transformedProducts);
          setProductsError(null);
          setLastSuccessfulLoad(new Date().toISOString());
          console.log('✅ Products loaded and transformed:', transformedProducts.length);
        } else {
          throw new Error('No products found in response');
        }
        
      } catch (productsError) {
        console.warn('⚠️ Main products endpoint failed, trying inventory endpoint');
        
        try {
          // Try inventory endpoint as backup
          productsResponse = await api.get('/inventory/products', { 
            params: { limit: 50 },
            timeout: 15000
          });
          
          if (productsResponse.data && Array.isArray(productsResponse.data)) {
            productData = productsResponse.data;
            setProducts(productData);
            setProductsError(null);
            setLastSuccessfulLoad(new Date().toISOString());
            console.log('✅ Products loaded from inventory endpoint:', productData.length);
          } else {
            throw new Error('Inventory endpoint also failed');
          }
          
        } catch (inventoryError) {
          console.error('❌ Both endpoints failed:', productsError.message, inventoryError.message);
          throw productsError; // Throw original error
        }
      }
      
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error('⚠️ Load failed:', error.message);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        setProductsError('Authentication required - session expired');
        setConnectionIssue(true);
      } else if (error.message.includes('timeout')) {
        setProductsError('Request timeout - server may be slow');
        setConnectionIssue(true);
      } else if (error.message.includes('Network Error')) {
        setProductsError('Network connection issue');
        setConnectionIssue(true);
      } else {
        setProductsError(`API Error: ${error.response?.status || 'Unknown'} - ${error.message}`);
      }
      
      // Use realistic fallback data based on your actual data structure
      setProducts([
        {
          _id: '1',
          name: 'Flour - Whole Wheat',
          quantity: 45,
          minQuantity: 20,
          price: { selling: 8.99 },
          category: 'Grains',
          totalValue: 404.55,
          lowStock: false,
          status: 'active'
        },
        {
          _id: '2',
          name: 'Organic Quinoa',
          quantity: 8,
          minQuantity: 15,
          price: { selling: 12.50 },
          category: 'Grains',
          totalValue: 100.00,
          lowStock: true,
          status: 'active'
        },
        {
          _id: '3',
          name: 'Tomatoes - Fresh',
          quantity: 25,
          minQuantity: 10,
          price: { selling: 3.99 },
          category: 'Produce',
          totalValue: 99.75,
          lowStock: false,
          status: 'active'
        }
      ]);
      
      console.log('📦 Using fallback product data');
    } finally {
      if (mountedRef.current) {
        setRefreshing(false);
        loadingRef.current = false;
      }
    }
  }, [isAuthenticated]);

  // Load data when authenticated (with debouncing)
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          loadDashboardData();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading, loadDashboardData]);

  const handleRefresh = useCallback(() => {
    if (!loadingRef.current) {
      loadDashboardData();
    }
  }, [loadDashboardData]);

  const handleGoogleLogin = () => {
    dispatch(initiateGoogleLogin('/dashboard'));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      cancelAllRequests();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    }
  };

  // Calculate statistics with improved logic
  const totalProducts = Array.isArray(products) ? products.length : 0;
  
  const lowStockProducts = Array.isArray(products) 
    ? products.filter(p => {
        // Check the lowStock flag first, then compare quantities
        if (p.lowStock === true) return true;
        const quantity = parseInt(p.quantity) || 0;
        const minQuantity = parseInt(p.minQuantity) || 10;
        return quantity <= minQuantity;
      }).length 
    : 0;
  
  const expiringProducts = Array.isArray(products) 
    ? products.filter(p => {
        // Check nearExpiry flag first
        if (p.nearExpiry === true) return true;
        
        // Check daysToExpiry if available
        if (p.daysToExpiry !== null && p.daysToExpiry !== undefined) {
          return p.daysToExpiry <= 30 && p.daysToExpiry > 0;
        }
        
        // Fallback to date calculation
        if (!p.expiryDate) return false;
        const expiryDate = new Date(p.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length 
    : 0;
  
  const expiredProducts = Array.isArray(products)
    ? products.filter(p => {
        // Check expired flag first
        if (p.expired === true) return true;
        
        // Check daysToExpiry
        if (p.daysToExpiry !== null && p.daysToExpiry !== undefined) {
          return p.daysToExpiry <= 0;
        }
        
        return false;
      }).length
    : 0;
  
  const totalValue = Array.isArray(products) 
    ? products.reduce((sum, p) => {
        // Use totalValue if available, otherwise calculate
        if (p.totalValue) {
          return sum + parseFloat(p.totalValue);
        }
        const quantity = parseInt(p.quantity) || 0;
        const price = parseFloat(p.price?.selling) || parseFloat(p.price) || 0;
        return sum + (quantity * price);
      }, 0) 
    : 0;

  // Chart data with proper configuration
  const inventoryValueChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inventory Value',
        data: [45000, 52000, 48000, 61000, 58000, totalValue || 65000],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryDistribution = {
    labels: ['Electronics', 'Food & Beverages', 'Healthcare', 'Clothing', 'Others'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#1976d2',
          '#43a047',
          '#e53935',
          '#fb8c00',
          '#8e24aa',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const stockLevelsChart = {
    labels: products.slice(0, 8).map(p => (p.name || 'Unknown').substring(0, 12) + '...'),
    datasets: [
      {
        label: 'Current Stock',
        data: products.slice(0, 8).map(p => parseInt(p.quantity) || 0),
        backgroundColor: '#43a047',
      },
      {
        label: 'Min Stock',
        data: products.slice(0, 8).map(p => parseInt(p.minQuantity) || 10),
        backgroundColor: '#e53935',
      },
    ],
  };

  // Chart options with proper scales
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const isLoading = authLoading || refreshing;

  // Show loading while checking authentication
  if (!initialized && authLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh' 
      }}>
        <LinearProgress sx={{ width: '300px', mb: 2 }} />
        <Typography>Initializing...</Typography>
      </Box>
    );
  }

  // Show login if not authenticated
  if (initialized && !isAuthenticated) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <Login sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Please Sign In
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You need to sign in to access your inventory dashboard
        </Typography>
        
        {authError && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 400 }}>
            {authError}
          </Alert>
        )}
        
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleGoogleLogin}
          startIcon={<Google />}
        >
          Sign in with Google
        </Button>
      </Box>
    );
  }

  // Main dashboard content
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={user?.avatar} 
              alt={user?.name}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="body1">
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role} • {user?.email}
              </Typography>
            </Box>
          </Box>
          {lastSuccessfulLoad && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Last updated: {dayjs(lastSuccessfulLoad).format('DD/MM/YYYY HH:mm')}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={isLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button 
            variant="outlined" 
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Loading indicator */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Connection issue alert */}
      {connectionIssue && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">⚠️ Connection Issue Detected</Typography>
          <Typography variant="body2">
            Rapid connect/disconnect detected. This can cause session instability.
            {productsError && <><br/>Error: {productsError}</>}
          </Typography>
        </Alert>
      )}
      
      {/* Products error (non-connection) */}
      {productsError && !connectionIssue && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">API Error:</Typography>
          <Typography variant="body2">{productsError}</Typography>
        </Alert>
      )}
      
      {/* Success indicator */}
      {!isLoading && !productsError && lastSuccessfulLoad && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Dashboard loaded successfully! Found {totalProducts} products.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory2 sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={lowStockProducts}
            icon={<Warning sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expiring Soon"
            value={expiringProducts}
            icon={<EventNote sx={{ color: 'error.main' }} />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Inventory Value Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                ref={lineChartRef}
                data={inventoryValueChart}
                options={lineChartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut
                ref={doughnutChartRef}
                data={categoryDistribution}
                options={doughnutChartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Stock Levels
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                ref={barChartRef}
                data={stockLevelsChart}
                options={barChartOptions}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Products List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Products ({products.length} items) {connectionIssue && '(Demo Data)'}
            </Typography>
            {products.length > 0 ? (
              <List>
                {products.slice(0, 5).map((product, index) => (
                  <ListItem key={product._id || index} divider>
                    <ListItemText
                      primary={product.name || 'Unnamed Product'}
                      secondary={`Quantity: ${product.quantity || 0} | Price: $${product.price?.selling || product.price || 0}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No products available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;