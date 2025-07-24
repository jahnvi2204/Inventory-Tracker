import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Adjust path as needed

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts', 
  async (params = {}, thunkAPI) => {
    try {
      console.log('Fetching products with params:', params);
      
      // Common product endpoint patterns - try the one that matches your backend
      const res = await api.get('/products', { params });
      // Alternative endpoints:
      // const res = await api.get('/inventory/products', { params });
      // const res = await api.get('/inventory', { params });
      // const res = await api.get('/items', { params });
      
      console.log('Products API response:', res.data);
      
      // Handle different response structures
      let products = [];
      if (res.data.products) {
        products = res.data.products;
      } else if (res.data.data) {
        products = res.data.data;
      } else if (Array.isArray(res.data)) {
        products = res.data;
      } else {
        console.warn('Unexpected products response structure:', res.data);
        products = [];
      }
      
      console.log('Processed products:', products.length, 'items');
      return Array.isArray(products) ? products : [];
    } catch (err) {
      console.error('Products API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'inventory/fetchProductById', 
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/products/${id}`);
      // Alternative: `/inventory/products/${id}`, `/items/${id}`
      
      console.log('Product by ID response:', res.data);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      console.error('Product by ID API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Failed to fetch product'
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  'inventory/addProduct', 
  async (product, thunkAPI) => {
    try {
      const res = await api.post('/products', product);
      // Alternative: '/inventory/products', '/items'
      
      console.log('Add product response:', res.data);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      console.error('Add Product API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Failed to add product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct', 
  async (product, thunkAPI) => {
    try {
      const res = await api.put(`/products/${product._id || product.id}`, product);
      // Alternative: `/inventory/products/${id}`, `/items/${id}`
      
      console.log('Update product response:', res.data);
      return res.data.product || res.data.data || res.data;
    } catch (err) {
      console.error('Update Product API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Failed to update product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct', 
  async (id, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      // Alternative: `/inventory/products/${id}`, `/items/${id}`
      
      return id;
    } catch (err) {
      console.error('Delete Product API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.response?.data || 
        err.message || 
        'Failed to delete product'
      );
    }
  }
);

// Get low stock products
export const fetchLowStockProducts = createAsyncThunk(
  'inventory/fetchLowStockProducts', 
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/products/low-stock');
      // Alternative: '/inventory/low-stock', '/products?filter=low-stock'
      
      console.log('Low stock products response:', res.data);
      return res.data.products || res.data.data || res.data || [];
    } catch (err) {
      console.error('Low Stock Products API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch low stock products'
      );
    }
  }
);

// Get expiring products
export const fetchExpiringProducts = createAsyncThunk(
  'inventory/fetchExpiringProducts', 
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/products/expiring');
      // Alternative: '/inventory/expiring', '/products?filter=expiring'
      
      console.log('Expiring products response:', res.data);
      return res.data.products || res.data.data || res.data || [];
    } catch (err) {
      console.error('Expiring Products API Error:', err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch expiring products'
      );
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: [],
    product: null,
    lowStockProducts: [],
    expiringProducts: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
    setProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        state.error = null;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Products fetch failed:', action.payload);
      })
      
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        if (action.payload) {
          state.products.push(action.payload);
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.products.findIndex(p => 
            p._id === action.payload._id || p.id === action.payload.id
          );
          if (idx !== -1) {
            state.products[idx] = action.payload;
          }
          if (state.product && 
              (state.product._id === action.payload._id || state.product.id === action.payload.id)) {
            state.product = action.payload;
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => 
          p._id !== action.payload && p.id !== action.payload
        );
        if (state.product && 
            (state.product._id === action.payload || state.product.id === action.payload)) {
          state.product = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Low Stock Products
      .addCase(fetchLowStockProducts.fulfilled, (state, action) => {
        state.lowStockProducts = action.payload;
      })
      
      // Expiring Products
      .addCase(fetchExpiringProducts.fulfilled, (state, action) => {
        state.expiringProducts = action.payload;
      });
  },
});

export const { clearError, clearProduct, setProducts } = inventorySlice.actions;
export default inventorySlice.reducer;