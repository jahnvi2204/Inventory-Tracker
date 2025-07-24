// src/pages/Inventory.js - Fixed to fetch real products like Dashboard
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Refresh,
  FilterList,
  GetApp,
  Warning,
  CheckCircle,
  Error,
  Schedule,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import api from '../services/api';
import axios from 'axios';

const Inventory = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  
  const mountedRef = useRef(true);
  const loadingRef = useRef(false);
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    nearExpiry: 0,
    expired: 0,
    categories: []
  });

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      loadingRef.current = false;
    };
  }, []);

  // Load products on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  // Load products function - same as Dashboard
  const loadProducts = useCallback(async () => {
    if (!isAuthenticated || !mountedRef.current || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading inventory products...');
      
      // Step 1: Verify session
      try {
        await api.get('/auth/status');
        if (!mountedRef.current) return;
        console.log('✅ Session verified for inventory');
      } catch (authError) {
        if (axios.isCancel(authError)) {
          console.log('Auth check cancelled');
        } else {
          throw authError;
        }
      }
      
      // Step 2: Try to load products with higher limit for inventory page
      let productsResponse;
      let productData = [];
      
      try {
        // First try the main products endpoint
        productsResponse = await api.get('/products', { 
          params: { limit: 500 }, // Get more products for inventory page
          timeout: 15000
        });
        
        if (!mountedRef.current) return;
        
        console.log('✅ Inventory products response:', productsResponse.data);
        
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
        
        // Transform the data to match expected format
        if (Array.isArray(productData) && productData.length > 0) {
          const transformedProducts = productData.map((product, index) => ({
            id: product.id || product._id || index,
            name: product.Name || product.name || product.ProductName || `Product ${index + 1}`,
            quantity: parseInt(product.Quantity) || parseInt(product.quantity) || 0,
            minQuantity: parseInt(product.MinQuantity) || parseInt(product.minQuantity) || parseInt(product.min_quantity) || 10,
            price: parseFloat(product.Price) || parseFloat(product.price) || parseFloat(product.sellingPrice) || 0,
            totalValue: parseFloat(product.TotalValue) || parseFloat(product.total_value) || 0,
            category: product.Category || product.category || product.CategoryID || 'Unknown',
            categoryId: product.CategoryID || product.category_id || product.categoryId || 0,
            barcode: product.Barcode || product.barcode || '',
            location: product.Location || product.location || '',
            status: product.Status || product.status || 'active',
            description: product.Description || product.description || '',
            expiryDate: product.ExpiryDate || product.expiry_date || product.expiryDate,
            modifyDate: product.ModifyDate || product.modify_date || product.updatedAt,
            lowStock: product.LowStock || product.low_stock || false,
            nearExpiry: product.NearExpiry || product.near_expiry || false,
            expired: product.Expired || product.expired || false,
            daysToExpiry: parseInt(product.DaysToExpiry) || parseInt(product.days_to_expiry) || null,
            resistant: product.Resistant || product.resistant || false,
            isAllergic: product.IsAllergic || product.is_allergic || false,
            vitalityDays: parseInt(product.VitalityDays) || parseInt(product.vitality_days) || null,
            supplierId: product.SupplierID || product.supplier_id || product.supplierId || null
          }));
          
          console.log('🔄 Transformed inventory products:', transformedProducts.length);
          setProducts(transformedProducts);
          
          // Calculate statistics
          calculateStats(transformedProducts);
          
          setLastFetch(new Date().toISOString());
          console.log('✅ Inventory products loaded:', transformedProducts.length);
        } else {
          throw new Error('No products found in response');
        }
        
      } catch (productsError) {
        if (axios.isCancel(productsError)) {
          console.log('Products request cancelled');
          return;
        }
        
        console.warn('⚠️ Main products endpoint failed, trying inventory endpoint');
        
        try {
          // Try inventory endpoint as backup
          productsResponse = await api.get('/inventory/products', { 
            params: { limit: 500 },
            timeout: 15000
          });
          
          if (!mountedRef.current) return;
          
          if (productsResponse.data && Array.isArray(productsResponse.data)) {
            productData = productsResponse.data;
            setProducts(productData);
            calculateStats(productData);
            setLastFetch(new Date().toISOString());
            console.log('✅ Inventory products loaded from inventory endpoint:', productData.length);
          } else {
            throw new Error('Inventory endpoint also failed');
          }
          
        } catch (inventoryError) {
          if (axios.isCancel(inventoryError)) {
            console.log('Inventory request cancelled');
            return;
          }
          
          console.error('❌ Both endpoints failed:', productsError.message, inventoryError.message);
          throw productsError;
        }
      }
      
    } catch (error) {
      if (!mountedRef.current) return;
      
      if (axios.isCancel(error)) {
        console.log('Inventory load cancelled');
        return;
      }
      
      console.error('⚠️ Inventory load failed:', error.message);
      setError(`Failed to load products: ${error.message}`);
      
      // Use fallback data for demo
      const fallbackProducts = [
        {
          id: 1,
          name: 'Flour - Whole Wheat',
          quantity: 45,
          minQuantity: 20,
          price: 8.99,
          totalValue: 404.55,
          category: 'Grains',
          categoryId: 3,
          barcode: '1234567890',
          location: 'A1-B2',
          status: 'active',
          lowStock: false,
          nearExpiry: false,
          expired: false,
          daysToExpiry: 45,
          modifyDate: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Organic Quinoa',
          quantity: 8,
          minQuantity: 15,
          price: 12.50,
          totalValue: 100.00,
          category: 'Grains',
          categoryId: 3,
          barcode: '0987654321',
          location: 'A1-B3',
          status: 'active',
          lowStock: true,
          nearExpiry: false,
          expired: false,
          daysToExpiry: 60,
          modifyDate: new Date().toISOString()
        }
      ];
      
      setProducts(fallbackProducts);
      calculateStats(fallbackProducts);
      console.log('📦 Using fallback inventory data');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        loadingRef.current = false;
      }
    }
  }, [isAuthenticated]);

  // Calculate statistics
  const calculateStats = (productList) => {
    const total = productList.length;
    const lowStock = productList.filter(p => p.lowStock || p.quantity <= p.minQuantity).length;
    const nearExpiry = productList.filter(p => p.nearExpiry || (p.daysToExpiry > 0 && p.daysToExpiry <= 30)).length;
    const expired = productList.filter(p => p.expired || p.daysToExpiry <= 0).length;
    
    // Get unique categories
    const categories = [...new Set(productList.map(p => p.category))].filter(Boolean);
    
    setStats({ total, lowStock, nearExpiry, expired, categories });
  };

  // Filter products based on search and filters
  const getFilteredProducts = () => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode.includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Stock filter
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = product.lowStock || product.quantity <= product.minQuantity;
      } else if (stockFilter === 'normal') {
        matchesStock = !product.lowStock && product.quantity > product.minQuantity;
      } else if (stockFilter === 'expiring') {
        matchesStock = product.nearExpiry || (product.daysToExpiry > 0 && product.daysToExpiry <= 30);
      } else if (stockFilter === 'expired') {
        matchesStock = product.expired || product.daysToExpiry <= 0;
      }
      
      return matchesSearch && matchesStatus && matchesCategory && matchesStock;
    });
  };

  const filteredProducts = getFilteredProducts();
  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Event handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    loadProducts();
  };

  const getStatusChip = (product) => {
    if (product.expired || product.daysToExpiry <= 0) {
      return <Chip label="Expired" color="error" size="small" icon={<Error />} />;
    }
    if (product.nearExpiry || (product.daysToExpiry > 0 && product.daysToExpiry <= 30)) {
      return <Chip label="Near Expiry" color="warning" size="small" icon={<Schedule />} />;
    }
    if (product.lowStock || product.quantity <= product.minQuantity) {
      return <Chip label="Low Stock" color="warning" size="small" icon={<Warning />} />;
    }
    return <Chip label="Normal" color="success" size="small" icon={<CheckCircle />} />;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please sign in to view inventory
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
            Inventory Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product inventory and stock levels
          </Typography>
          {lastFetch && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Last updated: {dayjs(lastFetch).format('MMM DD, YYYY HH:mm')}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Add />}>
            Add Product
          </Button>
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Low Stock
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.lowStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Near Expiry
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.nearExpiry}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Expired
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.expired}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {stats.categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={stockFilter}
                label="Stock Status"
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <MenuItem value="all">All Stock</MenuItem>
                <MenuItem value="low">Low Stock</MenuItem>
                <MenuItem value="normal">Normal Stock</MenuItem>
                <MenuItem value="expiring">Near Expiry</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} of {products.length} products
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Min Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {product.name}
                      </Typography>
                      {product.barcode && (
                        <Typography variant="caption" color="text.secondary">
                          {product.barcode}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={product.quantity <= product.minQuantity ? 'error' : 'inherit'}
                      fontWeight={product.quantity <= product.minQuantity ? 'bold' : 'normal'}
                    >
                      {product.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{product.minQuantity}</TableCell>
                  <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(product.totalValue)}</TableCell>
                  <TableCell>{product.location || 'N/A'}</TableCell>
                  <TableCell>
                    {getStatusChip(product)}
                  </TableCell>
                  <TableCell>
                    {product.expiryDate ? (
                      <Box>
                        <Typography variant="body2">
                          {formatDate(product.expiryDate)}
                        </Typography>
                        {product.daysToExpiry !== null && (
                          <Typography variant="caption" color="text.secondary">
                            {product.daysToExpiry > 0 ? `${product.daysToExpiry} days left` : 'Expired'}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Inventory;