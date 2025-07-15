const Product = require('../models/Product');

module.exports = function scheduledTasks() {
  // Example: Daily inventory check for low stock and near expiry
  setInterval(async () => {
    try {
      const lowStockProducts = await Product.find({ 'alerts.lowStock': true });
      const nearExpiryProducts = await Product.find({ 'alerts.nearExpiry': true });
      // Here you could send notifications, emails, or emit socket events
      // For example, emit to all organizations:
      // const io = ... (get from app context if needed)
      // io.emit('inventory-alerts', { lowStockProducts, nearExpiryProducts });
      console.log('Scheduled inventory check:', {
        lowStock: lowStockProducts.length,
        nearExpiry: nearExpiryProducts.length
      });
    } catch (err) {
      console.error('Scheduled task error:', err);
    }
  }, 24 * 60 * 60 * 1000); // Run once every 24 hours
}; 