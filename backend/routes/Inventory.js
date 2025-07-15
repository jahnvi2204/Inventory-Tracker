// routes/inventory.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const InventoryTransaction = require('../models/InventoryTransaction');
const { isAuthenticated, hasRole } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Get all products with filtering and pagination
router.get('/products', isAuthenticated, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      status,
      lowStock,
      nearExpiry,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { organization: req.user.organization };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Low stock filter
    if (lowStock === 'true') {
      query['alerts.lowStock'] = true;
    }

    // Near expiry filter
    if (nearExpiry === 'true') {
      query['alerts.nearExpiry'] = true;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('addedBy', 'name email')
        .populate('lastModifiedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get product by barcode
router.get('/products/barcode/:barcode', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findOne({
      barcode: req.params.barcode,
      organization: req.user.organization
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Create new product
router.post('/products', isAuthenticated, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      organization: req.user.organization,
      addedBy: req.user._id
    };

    const product = new Product(productData);
    await product.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(req.user.organization.toString()).emit('product-added', product);

    // Create inventory transaction
    await InventoryTransaction.create({
      product: product._id,
      type: 'addition',
      quantity: product.quantity,
      user: req.user._id,
      organization: req.user.organization,
      notes: 'Initial stock'
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product
router.put('/products/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const oldQuantity = product.quantity;
    
    Object.assign(product, req.body);
    product.lastModifiedBy = req.user._id;
    
    await product.save();

    // Create transaction if quantity changed
    if (oldQuantity !== product.quantity) {
      const difference = product.quantity - oldQuantity;
      await InventoryTransaction.create({
        product: product._id,
        type: difference > 0 ? 'addition' : 'removal',
        quantity: Math.abs(difference),
        user: req.user._id,
        organization: req.user.organization,
        notes: req.body.notes || 'Manual adjustment'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(req.user.organization.toString()).emit('product-updated', product);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete product
router.delete('/products/:id', isAuthenticated, hasRole(['owner', 'admin']), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      organization: req.user.organization
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.to(req.user.organization.toString()).emit('product-deleted', req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// Bulk import products
router.post('/products/import', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    // Parse CSV/Excel file and import products
    // Implementation depends on file format
    
    res.json({
      success: true,
      message: 'Import process started'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to import products',
      error: error.message
    });
  }
});

// Get inventory transactions
router.get('/transactions', isAuthenticated, async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, type } = req.query;
    
    const query = { organization: req.user.organization };
    
    if (productId) {
      query.product = productId;
    }
    
    if (type) {
      query.type = type;
    }
    
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      InventoryTransaction.find(query)
        .populate('product', 'name barcode')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      InventoryTransaction.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
});

module.exports = router;