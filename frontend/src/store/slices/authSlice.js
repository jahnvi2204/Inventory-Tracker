// src/store/slices/authSlice.js - Session-based authentication
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Adjust path as needed

// Check authentication status
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/status');
      console.log('Auth status response:', response.data);
      
      if (response.data.isAuthenticated && response.data.user) {
        return response.data.user;
      } else {
        throw new Error('Not authenticated');
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Authentication check failed'
      );
    }
  }
);

// Google OAuth login (redirect)
export const initiateGoogleLogin = createAsyncThunk(
  'auth/initiateGoogleLogin',
  async (returnUrl = '/dashboard', thunkAPI) => {
    try {
      // Store return URL in localStorage for after redirect
      if (returnUrl) {
        localStorage.setItem('auth_return_url', returnUrl);
      }
      
      // Redirect to backend Google OAuth endpoint
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      window.location.href = `${backendUrl}/auth/google`;
      
      // This thunk doesn't return anything as it redirects
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to initiate Google login');
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await api.post('/auth/logout');
      // Clear any stored data
      localStorage.removeItem('auth_return_url');
      return null;
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on backend, clear local state
      localStorage.removeItem('auth_return_url');
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false, // Track if we've checked auth status
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setInitialized: (state) => {
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.initialized = true;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state) => {
        // Clear state even if logout fails
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError, setUser, clearUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;