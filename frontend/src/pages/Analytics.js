// src/pages/Analytics.js - Fixed to fetch real products like Dashboard
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  Assessment,
  PieChart,
  BarChart,
  Timeline,
  Warning,
  CheckCircle,
  Error,
  Schedule,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
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
import api from '../services/api';
import axios from 'axios';

// Register Chart.js components
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

const Analytics = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  
  const mountedRef = useRef(true);
  const loadingRef = useRef(false);
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [timeRange, setTimeRange] = useState('30');

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalValue: 0,
    categoryDistribution: {},
    stockLevels: {},
    expiryAnalysis: {},
    trends: [],
    alerts: {
      lowStock: 0,
      nearExpiry: 0,
      expired: 0
    }
  });

  // Chart refs for cleanup
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      loadingRef.current = false;
      
      // Destroy charts
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalyticsData();
    }
  }, [isAuthenticated, timeRange]);

  // Load analytics data - same as Dashboard/Inventory
  const loadAnalyticsData = useCallback(async () => {
    if (!isAuthenticated || !mountedRef.current || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading analytics data...');
      
      // Step 1: Verify session
      try {
        await api.get('/auth/status');
        if (!mountedRef.current) return;
        console.log('✅ Session verified for analytics');
      } catch (authError) {
        if (axios.isCancel(authError)) {
          console.log('Auth check cancelled');
        } else {
          throw authError;
        }
      }
      
      // Step 2: Try to load products for analytics
      let productsResponse;
      let productData = [];
      
      try {
        // First try the main products endpoint
        productsResponse = await api.get('/products', { 
          params: { limit: 1000 }, // Get all products for complete analytics
          timeout: 15000
        });
        
        if (!mountedRef.current) return;
        
        console.log('✅ Analytics products response:', productsResponse.data);
        
        // Handle different response structures from Python API
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
        
        // Transform the data for analytics
        if (Array.isArray(productData) && productData.length > 0) {
          const transformedProducts = productData.map((product, index) => ({
            id: product.id || product._id || index,
            name: product.Name || product.name || product.ProductName || `Product ${index + 1}`,
            quantity: parseInt(product.Quantity) || parseInt(product.quantity) || 0,
            minQuantity: parseInt(product.MinQuantity) || parseInt(product.minQuantity) || 10,
            price: parseFloat(product.Price) || parseFloat(product.price) || 0,
            totalValue: parseFloat(product.TotalValue) || parseFloat(product.total_value) || 0,
            category: product.Category || product.category || product.CategoryID || 'Unknown',
            categoryId: product.CategoryID || product.category_id || 0,
            location: product.Location || product.location || '',
            status: product.Status || product.status || 'active',
            expiryDate: product.ExpiryDate || product.expiry_date,
            modifyDate: product.ModifyDate || product.modify_date || product.updatedAt,
            lowStock: product.LowStock || product.low_stock || false,
            nearExpiry: product.NearExpiry || product.near_expiry || false,
            expired: product.Expired || product.expired || false,
            daysToExpiry: parseInt(product.DaysToExpiry) || parseInt(product.days_to_expiry) || null,
            resistant: product.Resistant || product.resistant || false,
            isAllergic: product.IsAllergic || product.is_allergic || false,
            vitalityDays: parseInt(product.VitalityDays) || parseInt(product.vitality_days) || null
          }));
          
          console.log('🔄 Transformed analytics products:', transformedProducts.length);
          setProducts(transformedProducts);
          
          // Generate analytics from product data
          generateAnalytics(transformedProducts);
          
          setLastFetch(new Date().toISOString());
          console.log('✅ Analytics data processed:', transformedProducts.length);
        } else {
          throw new Error('No products found for analytics');
        }
        
      } catch (productsError) {
        if (axios.isCancel(productsError)) {
          console.log('Analytics products request cancelled');
          return;
        }
        
        console.warn('⚠️ Main products endpoint failed, trying alternatives');
        
        try {
          // Try analytics endpoint if available
          const analyticsResponse = await api.get('/analytics/summary', { 
            timeout: 10000
          });
          
          if (!mountedRef.current) return;
          
          if (analyticsResponse.data) {
            console.log('✅ Analytics endpoint response received');
            // Process analytics response if available
            processAnalyticsResponse(analyticsResponse.data);
          } else {
            throw new Error('Analytics endpoint failed');
          }
          
        } catch (analyticsError) {
          if (axios.isCancel(analyticsError)) {
            console.log('Analytics request cancelled');
            return;
          }
          
          console.error('❌ All analytics endpoints failed:', productsError.message, analyticsError.message);
          throw productsError;
        }
      }
      
    } catch (error) {
      if (!mountedRef.current) return;
      
      if (axios.isCancel(error)) {
        console.log('Analytics load cancelled');
        return;
      }
      
      console.error('⚠️ Analytics load failed:', error.message);
      setError(`Failed to load analytics: ${error.message}`);
      
      // Use fallback data for demo
      generateFallbackAnalytics();
      
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        loadingRef.current = false;
      }
    }
  }, [isAuthenticated, timeRange]);

  // Generate analytics from product data
  const generateAnalytics = (productList) => {
    // Calculate total value
    const totalValue = productList.reduce((sum, product) => {
      return sum + (product.totalValue || (product.quantity * product.price));
    }, 0);

    // Category distribution
    const categoryDistribution = {};
    const categoryValues = {};
    productList.forEach(product => {
      const category = product.category || 'Unknown';
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      categoryValues[category] = (categoryValues[category] || 0) + (product.totalValue || (product.quantity * product.price));
    });

    // Stock levels analysis
    const stockLevels = {
      adequate: productList.filter(p => !p.lowStock && p.quantity > p.minQuantity).length,
      low: productList.filter(p => p.lowStock || p.quantity <= p.minQuantity).length,
      critical: productList.filter(p => p.quantity === 0).length
    };

    // Expiry analysis
    const expiryAnalysis = {
      fresh: productList.filter(p => !p.nearExpiry && !p.expired && (p.daysToExpiry > 30 || p.daysToExpiry === null)).length,
      nearExpiry: productList.filter(p => p.nearExpiry || (p.daysToExpiry > 0 && p.daysToExpiry <= 30)).length,
      expired: productList.filter(p => p.expired || p.daysToExpiry <= 0).length
    };

    // Generate trend data (mock for now - could be enhanced with historical data)
    const trends = generateTrendData(totalValue);

    // Alerts
    const alerts = {
      lowStock: stockLevels.low,
      nearExpiry: expiryAnalysis.nearExpiry,
      expired: expiryAnalysis.expired
    };

    setAnalytics({
      totalValue,
      categoryDistribution: {
        labels: Object.keys(categoryDistribution),
        counts: Object.values(categoryDistribution),
        values: Object.values(categoryValues)
      },
      stockLevels,
      expiryAnalysis,
      trends,
      alerts
    });
  };

  // Generate trend data
  const generateTrendData = (currentValue) => {
    const days = parseInt(timeRange);
    const trends = [];
    
    for (let i = days; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      const value = currentValue * (1 + variance);
      
      trends.push({
        date: date.format('MMM DD'),
        value: Math.max(0, value),
        products: Math.floor(Math.random() * 50) + products.length - 25
      });
    }
    
    return trends;
  };

  // Process analytics response from backend
  const processAnalyticsResponse = (data) => {
    // If backend provides analytics data, use it
    setAnalytics(prev => ({
      ...prev,
      ...data
    }));
  };

  // Generate fallback analytics for demo
  const generateFallbackAnalytics = () => {
    const fallbackProducts = [
      {
        id: 1,
        name: 'Flour - Whole Wheat',
        quantity: 45,
        minQuantity: 20,
        price: 8.99,
        totalValue: 404.55,
        category: 'Grains',
        lowStock: false,
        nearExpiry: false,
        expired: false,
        daysToExpiry: 45
      },
      {
        id: 2,
        name: 'Organic Quinoa',
        quantity: 8,
        minQuantity: 15,
        price: 12.50,
        totalValue: 100.00,
        category: 'Grains',
        lowStock: true,
        nearExpiry: false,
        expired: false,
        daysToExpiry: 60
      },
      {
        id: 3,
        name: 'Fresh Milk',
        quantity: 25,
        minQuantity: 10,
        price: 3.99,
        totalValue: 99.75,
        category: 'Dairy',
        lowStock: false,
        nearExpiry: true,
        expired: false,
        daysToExpiry: 2
      }
    ];
    
    setProducts(fallbackProducts);
    generateAnalytics(fallbackProducts);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  // Chart configurations
  const inventoryTrendChart = {
    labels: analytics.trends.map(t => t.date),
    datasets: [
      {
        label: 'Inventory Value',
        data: analytics.trends.map(t => t.value),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryChart = {
    labels: analytics.categoryDistribution.labels || [],
    datasets: [
      {
        data: analytics.categoryDistribution.values || [],
        backgroundColor: [
          '#1976d2',
          '#43a047',
          '#e53935',
          '#fb8c00',
          '#8e24aa',
          '#00acc1',
          '#7cb342',
          '#ffa726'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const stockLevelsChart = {
    labels: ['Adequate Stock', 'Low Stock', 'Critical'],
    datasets: [
      {
        data: [
          analytics.stockLevels.adequate || 0,
          analytics.stockLevels.low || 0,
          analytics.stockLevels.critical || 0
        ],
        backgroundColor: ['#43a047', '#fb8c00', '#e53935'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const expiryChart = {
    labels: ['Fresh', 'Near Expiry', 'Expired'],
    datasets: [
      {
        data: [
          analytics.expiryAnalysis.fresh || 0,
          analytics.expiryAnalysis.nearExpiry || 0,
          analytics.expiryAnalysis.expired || 0
        ],
        backgroundColor: ['#43a047', '#fb8c00', '#e53935'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Chart options
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please sign in to view analytics
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analysis of your inventory performance
          </Typography>
          {lastFetch && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Last updated: {dayjs(lastFetch).format('MMM DD, YYYY HH:mm')}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading indicator */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Inventory Value
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(analytics.totalValue)}
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Low Stock Alerts
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {analytics.alerts.lowStock}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Near Expiry
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {analytics.alerts.nearExpiry}
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Expired Items
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {analytics.alerts.expired}
                  </Typography>
                </Box>
                <Error sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Inventory Value Trend
            </Typography>
            <Box sx={{ height: 320 }}>
              <Line
                ref={lineChartRef}
                data={inventoryTrendChart}
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
            <Box sx={{ height: 320 }}>
              <Doughnut
                ref={doughnutChartRef}
                data={categoryChart}
                options={pieChartOptions}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Stock Level Analysis
            </Typography>
            <Box sx={{ height: 320 }}>
              <Pie
                ref={pieChartRef}
                data={stockLevelsChart}
                options={pieChartOptions}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Expiry Status Analysis
            </Typography>
            <Box sx={{ height: 320 }}>
              <Pie
                ref={barChartRef}
                data={expiryChart}
                options={pieChartOptions}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;