import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('inventory/fetchProducts', async (params, thunkAPI) => {
  try {
    const res = await api.get('/inventory/products', { params });
    return res.data.products;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchProductById = createAsyncThunk('inventory/fetchProductById', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/inventory/products/${id}`);
    return res.data.product;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const addProduct = createAsyncThunk('inventory/addProduct', async (product, thunkAPI) => {
  try {
    const res = await api.post('/inventory/products', product);
    return res.data.product;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const updateProduct = createAsyncThunk('inventory/updateProduct', async (product, thunkAPI) => {
  try {
    const res = await api.put(`/inventory/products/${product._id}`, product);
    return res.data.product;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
        if (state.product && state.product._id === action.payload._id) {
          state.product = action.payload;
        }
      });
  },
});

export default inventorySlice.reducer; 