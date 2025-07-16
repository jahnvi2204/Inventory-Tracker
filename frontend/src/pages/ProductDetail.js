import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, TextField, Chip, CircularProgress, Grid, Paper } from '@mui/material';
import { fetchProductById, updateProduct } from '../store/slices/inventorySlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.inventory);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateProduct(form));
    setEditMode(false);
  };

  if (loading || !form) return <CircularProgress />;

  return (
    <Box>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Product Details</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Category"
              name="category"
              value={form.category || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity || 0}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Status"
              name="status"
              value={form.status || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Chip label={`Stock: ${form.quantity}`} color={form.alerts?.lowStock ? 'warning' : 'primary'} sx={{ mr: 1 }} />
            {form.alerts?.nearExpiry && <Chip label="Near Expiry" color="error" />}
            <Typography variant="body2" sx={{ mt: 2 }}>
              SKU: {form.sku}
            </Typography>
            <Typography variant="body2">Barcode: {form.barcode}</Typography>
            <Typography variant="body2">Price: ${form.price}</Typography>
            <Typography variant="body2">Expiry: {form.expiryDate}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          {editMode ? (
            <Button variant="contained" onClick={handleSave}>Save</Button>
          ) : (
            <Button variant="outlined" onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductDetail; 