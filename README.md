Inventory Management System

This API provides comprehensive inventory management endpoints that align with
the Node.js inventory system, including products, analytics, alerts, and reporting.

Key Features:
- Product CRUD operations
- Real-time inventory tracking
- Expiry and low stock alerts
- Analytics and reporting
- Bulk operations
- Activity logging

Endpoints Overview:
------------------
Products:
    GET    /api/products                 - List all products with filtering
    POST   /api/products                 - Create new product
    GET    /api/products/{id}            - Get product details
    PUT    /api/products/{id}            - Update product
    DELETE /api/products/{id}            - Delete product
    POST   /api/products/bulk            - Bulk import products

Inventory Management:
    PUT    /api/products/{id}/stock      - Update stock quantity
    POST   /api/products/{id}/movement   - Record stock movement
    GET    /api/movements                - Get stock movement history

Alerts & Monitoring:
    GET    /api/alerts/low-stock         - Products below minimum quantity
    GET    /api/alerts/expiring          - Products expiring soon
    GET    /api/alerts/expired           - Expired products

Analytics & Reports:
    GET    /api/analytics/dashboard      - Dashboard summary data
    GET    /api/analytics/value          - Inventory value analytics
    GET    /api/analytics/trends         - Stock level trends
    GET    /api/reports/inventory        - Comprehensive inventory report

Categories:
    GET    /api/categories               - List all categories
    GET    /api/categories/{id}/products - Products in category

System:
    POST   /api/refresh                  - Reload data from CSV
    GET    /api/health                   - System health check

Data Format:
-----------
Expected CSV columns:
    ProductID, Name, CategoryID, Category, Price, Quantity, MinQuantity,
    ExpiryDate, SupplierID, Barcode, Description, Location, Status

Run:
----
$ python app.py  # http://127.0.0.1:5001

Dependencies:
$ pip install flask pandas python-dateutil

