// src/store/slices/dashboardSlice.js - Fixed with correct endpoints
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData', 
  async (_, thunkAPI) => {
    try {
      // Try different dashboard endpoints since /dashboard/stats returns 404
      let res;
      
      try {
        res = await api.get('/dashboard');
      } catch (error) {
        if (error.response?.status === 404) {
          // Try alternative endpoints
          try {
            res = await api.get('/analytics');
          } catch (error2) {
            if (error2.response?.status === 404) {
              try {
                res = await api.get('/stats');
              } catch (error3) {
                // If all specific endpoints fail, create mock data
                console.warn('No dashboard endpoint found, using calculated stats from products');
                return thunkAPI.rejectWithValue('Dashboard endpoint not found');
              }
            } else {
              throw error2;
            }
          }
        } else {
          throw error;
        }
      }
      
      console.log('Dashboard API response:', res.data);
      return res.data.data || res.data;
    } catch (err) {
      console.error('Dashboard API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Failed to fetch dashboard data'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalProducts: 0,
      lowStockProducts: 0,
      expiringProducts: 0,
      totalValue: 0
    },
    recentActivity: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    // Add action to calculate stats from products
    calculateStatsFromProducts: (state, action) => {
      const products = action.payload || [];
      
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => {
        const quantity = p?.quantity || 0;
        const minQuantity = p?.minQuantity || 0;
        return minQuantity > 0 && quantity <= minQuantity;
      }).length;
      
      const expiringProducts = products.filter(p => {
        if (!p?.expiryDate) return false;
        const expiryDate = new Date(p.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
      }).length;
      
      const totalValue = products.reduce((sum, p) => {
        const quantity = p?.quantity || 0;
        const price = p?.price?.selling || p?.price || p?.sellingPrice || 0;
        return sum + (quantity * price);
      }, 0);
      
      state.stats = {
        totalProducts,
        lowStockProducts,
        expiringProducts,
        totalValue
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        if (action.payload) {
          if (action.payload.stats) {
            state.stats = action.payload.stats;
          } else {
            state.stats = {
              totalProducts: action.payload.totalProducts || action.payload.total_products || 0,
              lowStockProducts: action.payload.lowStockProducts || action.payload.low_stock_products || 0,
              expiringProducts: action.payload.expiringProducts || action.payload.expiring_products || 0,
              totalValue: action.payload.totalValue || action.payload.total_value || 0
            };
          }
          
          if (action.payload.recentActivity) {
            state.recentActivity = action.payload.recentActivity;
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.warn('Dashboard fetch failed, will calculate from products:', action.payload);
      });
  },
});

export const { clearError, updateStats, calculateStatsFromProducts } = dashboardSlice.actions;
export default dashboardSlice.reducer;