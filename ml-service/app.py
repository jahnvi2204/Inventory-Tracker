# inventory_api_flask/app.py
from pathlib import Path
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta
import json
import uuid
from dateutil import parser
import logging
import numpy as np
import jwt
from functools import wraps

# Configuration
DATA_PATH = Path("products.csv")
MOVEMENTS_PATH = Path("stock_movements.csv")
ACTIVITY_PATH = Path("activity_log.csv")

JWT_SECRET = 'your_jwt_secret'  # Use the same secret as Node backend

app = Flask("inventory_management_api")
CORS(app)  # Enable CORS for frontend integration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --------------------------------------------------
# Data Management & Utilities
# --------------------------------------------------

def standardize_columns(df):
    """Standardize column names for products.csv"""
    # Map the actual CSV columns to expected format
    col_map = {
        'ProductID': 'ProductID',
        'ProductName': 'Name',
        'Price': 'Price',
        'CategoryID': 'CategoryID',
        'Class': 'Category',
        'ModifyDate': 'ModifyDate',
        'Resistant': 'Resistant',
        'IsAllergic': 'IsAllergic',
        'VitalityDays': 'VitalityDays'
    }
    
    # Rename columns that exist
    df = df.rename(columns={k: v for k, v in col_map.items() if k in df.columns})
    
    # Ensure ProductID is string
    if 'ProductID' in df.columns:
        df['ProductID'] = df['ProductID'].astype(str)
    
    # Add missing required columns with default values
    required_columns = {
        'Quantity': lambda: np.random.randint(0, 200, len(df)),  # Random stock levels
        'MinQuantity': lambda: np.random.randint(5, 50, len(df)),  # Random min quantities
        'SupplierID': lambda: [f'SUP{str(i).zfill(3)}' for i in range(1, len(df) + 1)],
        'Barcode': lambda: [f'{str(i).zfill(12)}' for i in range(1000000000000, 1000000000000 + len(df))],
        'Location': lambda: [f'A{(i%10)+1}-{str((i//10)+1).zfill(2)}' for i in range(len(df))],
        'Status': lambda: ['Active'] * len(df),
        'Description': lambda: df['Name'].apply(lambda x: f'High-quality {x}' if pd.notna(x) else 'Product description'),
        'ExpiryDate': lambda: [(datetime.now() + timedelta(days=np.random.randint(30, 365))).strftime('%Y-%m-%d') if df.loc[i, 'VitalityDays'] > 0 else None for i in range(len(df))]
    }
    
    for col, default_func in required_columns.items():
        if col not in df.columns:
            df[col] = default_func()
    
    return df

def calculate_derived_fields(df):
    """Calculate derived fields for inventory management"""
    # Calculate total value
    df['TotalValue'] = df['Quantity'] * df['Price']
    
    # Calculate low stock indicator
    df['LowStock'] = df['Quantity'] <= df['MinQuantity']
    
    # Calculate expiry-related fields
    df['DaysToExpiry'] = None
    df['NearExpiry'] = False
    df['Expired'] = False
    
    for idx, row in df.iterrows():
        if pd.notna(row['ExpiryDate']) and row['ExpiryDate']:
            try:
                expiry_date = pd.to_datetime(row['ExpiryDate'])
                days_to_expiry = (expiry_date - datetime.now()).days
                df.at[idx, 'DaysToExpiry'] = days_to_expiry
                df.at[idx, 'NearExpiry'] = days_to_expiry <= 7 and days_to_expiry > 0
                df.at[idx, 'Expired'] = days_to_expiry < 0
            except:
                pass
    
    return df

def load_inventory_data() -> pd.DataFrame:
    """Load inventory data from products.csv"""
    try:
        if not DATA_PATH.exists():
            logger.error(f"Data file {DATA_PATH} not found")
            return create_sample_data()
        
        # Load the CSV file
        df = pd.read_csv(DATA_PATH)
        logger.info(f"Loaded {len(df)} products from {DATA_PATH}")
        
        # Standardize columns
        df = standardize_columns(df)
        
        # Remove rows with missing ProductID or Name
        df = df.dropna(subset=['ProductID', 'Name'])
        
        # Ensure ProductID is unique
        df = df.drop_duplicates(subset=['ProductID'], keep='first')
        
        # Calculate derived fields
        df = calculate_derived_fields(df)
        
        # Set ProductID as index
        df = df.set_index('ProductID')
        
        logger.info(f"Processed {len(df)} products successfully")
        return df
        
    except Exception as e:
        logger.error(f"Error loading inventory data: {e}")
        return create_sample_data()

def create_sample_data():
    """Create sample inventory data if CSV loading fails"""
    sample_data = {
        'ProductID': ['P001', 'P002', 'P003', 'P004', 'P005'],
        'Name': ['Laptop Pro 15"', 'Wireless Mouse', 'USB Cable', 'Monitor 24"', 'Keyboard Mechanical'],
        'CategoryID': [1, 2, 3, 1, 2],
        'Category': ['Electronics', 'Accessories', 'Cables', 'Electronics', 'Accessories'],
        'Price': [1299.99, 29.99, 9.99, 299.99, 89.99],
        'Quantity': [45, 120, 500, 30, 75],
        'MinQuantity': [10, 50, 100, 5, 20],
        'ExpiryDate': [
            (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d'),
            None, None,
            (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            None
        ],
        'SupplierID': ['SUP001', 'SUP002', 'SUP001', 'SUP003', 'SUP002'],
        'Barcode': ['123456789012', '123456789013', '123456789014', '123456789015', '123456789016'],
        'Description': [
            'High-performance laptop for professionals',
            'Ergonomic wireless mouse with precision tracking',
            'Durable USB-C cable 1m length',
            'Full HD monitor with IPS panel',
            'Mechanical keyboard with RGB backlighting'
        ],
        'Location': ['A1-01', 'B2-15', 'C3-22', 'A1-05', 'B2-18'],
        'Status': ['Active', 'Active', 'Active', 'Active', 'Active']
    }
    
    df = pd.DataFrame(sample_data)
    df = calculate_derived_fields(df)
    df = df.set_index('ProductID')
    
    logger.info("Created sample data with 5 products")
    return df

def log_activity(action, product_id=None, details=None, user='system'):
    """Log inventory activities"""
    try:
        activity_data = {
            'timestamp': datetime.now().isoformat(),
            'action': action,
            'product_id': product_id,
            'user': user,
            'details': json.dumps(details) if details else None
        }
        
        # Append to activity log
        df_activity = pd.DataFrame([activity_data])
        
        if ACTIVITY_PATH.exists():
            df_existing = pd.read_csv(ACTIVITY_PATH)
            df_activity = pd.concat([df_existing, df_activity], ignore_index=True)
        
        df_activity.to_csv(ACTIVITY_PATH, index=False)
    except Exception as e:
        logger.error(f"Error logging activity: {e}")

def save_inventory_data(df):
    """Save inventory data back to CSV"""
    try:
        df_to_save = df.reset_index()
        # Only save the original columns to maintain CSV structure
        original_columns = ['ProductID', 'Name', 'Price', 'CategoryID', 'Category', 'Quantity', 'MinQuantity', 'SupplierID', 'Barcode', 'Location', 'Status', 'Description', 'ExpiryDate']
        df_to_save = df_to_save[[col for col in original_columns if col in df_to_save.columns]]
        df_to_save.to_csv(DATA_PATH, index=False)
        log_activity('data_saved', details={'num_products': len(df)})
    except Exception as e:
        logger.error(f"Error saving inventory data: {e}")
        raise

# Load initial data
try:
    inventory_df = load_inventory_data()
    logger.info(f"Successfully loaded {len(inventory_df)} products")
except Exception as e:
    logger.error(f"Failed to load initial data: {e}")
    inventory_df = create_sample_data()

# --------------------------------------------------
# Product Management Endpoints
# --------------------------------------------------

def safe_convert(value, conversion_func, default=None):
    """Safely convert values with fallback"""
    try:
        if pd.isna(value):
            return default
        return conversion_func(value)
    except:
        return default

def safe_date_str(dt):
    """Safely convert date to string"""
    if pd.isna(dt) or dt is None:
        return None
    try:
        if isinstance(dt, str):
            return dt
        return dt.strftime('%Y-%m-%d')
    except:
        return None

def require_jwt(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth or not auth.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        token = auth.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return wrapper

@app.route("/api/products", methods=["GET"])
def get_products():
    """Get all products with filtering and pagination"""
    global inventory_df
    
    try:
        df = inventory_df.copy()
        
        # Apply filters
        category = request.args.get('category')
        search = request.args.get('search')
        low_stock = request.args.get('low_stock', '').lower() == 'true'
        expiring = request.args.get('expiring', '').lower() == 'true'
        
        if category:
            df = df[df['CategoryID'].astype(str) == str(category)]
        
        if search:
            search_mask = (
                df['Name'].str.contains(search, case=False, na=False) |
                df['Category'].str.contains(search, case=False, na=False) |
                df.index.str.contains(search, case=False, na=False)
            )
            df = df[search_mask]
        
        if low_stock:
            df = df[df['LowStock'] == True]
        
        if expiring:
            df = df[df['NearExpiry'] == True]
        
        # Pagination
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        
        total_count = len(df)
        df_page = df.iloc[start_idx:end_idx]
        
        # Convert to products list
        products = []
        for product_id, row in df_page.iterrows():
            product = {
                'ProductID': product_id,
                'Name': row['Name'],
                'Price': safe_convert(row['Price'], float, 0.0),
                'CategoryID': safe_convert(row['CategoryID'], str, 'Unknown'),
                'Category': safe_convert(row['Category'], str, 'Unknown'),
                'Quantity': safe_convert(row['Quantity'], int, 0),
                'MinQuantity': safe_convert(row['MinQuantity'], int, 0),
                'TotalValue': safe_convert(row['TotalValue'], float, 0.0),
                'LowStock': safe_convert(row['LowStock'], bool, False),
                'NearExpiry': safe_convert(row['NearExpiry'], bool, False),
                'Expired': safe_convert(row['Expired'], bool, False),
                'DaysToExpiry': safe_convert(row['DaysToExpiry'], int, None),
                'ExpiryDate': safe_date_str(row.get('ExpiryDate')),
                'SupplierID': safe_convert(row['SupplierID'], str, 'Unknown'),
                'Barcode': safe_convert(row['Barcode'], str, ''),
                'Location': safe_convert(row['Location'], str, 'Unknown'),
                'Status': safe_convert(row['Status'], str, 'Active'),
                'Description': safe_convert(row['Description'], str, ''),
                'VitalityDays': safe_convert(row.get('VitalityDays'), float, None),
                'Resistant': safe_convert(row.get('Resistant'), str, None),
                'IsAllergic': safe_convert(row.get('IsAllergic'), str, None)
            }
            products.append(product)
        
        return jsonify({
            'products': products,
            'pagination': {
                'current_page': page,
                'total_pages': (total_count + limit - 1) // limit,
                'total_count': total_count,
                'has_next': end_idx < total_count,
                'has_prev': page > 1
            }
        })
    
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/products/<product_id>", methods=["GET"])
def get_product(product_id):
    """Get detailed information for a specific product"""
    try:
        if product_id not in inventory_df.index:
            return jsonify({'error': 'Product not found'}), 404
        
        row = inventory_df.loc[product_id]
        
        product = {
            'ProductID': product_id,
            'Name': row['Name'],
            'Price': safe_convert(row['Price'], float, 0.0),
            'CategoryID': safe_convert(row['CategoryID'], str, 'Unknown'),
            'Category': safe_convert(row['Category'], str, 'Unknown'),
            'Quantity': safe_convert(row['Quantity'], int, 0),
            'MinQuantity': safe_convert(row['MinQuantity'], int, 0),
            'TotalValue': safe_convert(row['TotalValue'], float, 0.0),
            'LowStock': safe_convert(row['LowStock'], bool, False),
            'NearExpiry': safe_convert(row['NearExpiry'], bool, False),
            'Expired': safe_convert(row['Expired'], bool, False),
            'DaysToExpiry': safe_convert(row['DaysToExpiry'], int, None),
            'ExpiryDate': safe_date_str(row.get('ExpiryDate')),
            'SupplierID': safe_convert(row['SupplierID'], str, 'Unknown'),
            'Barcode': safe_convert(row['Barcode'], str, ''),
            'Location': safe_convert(row['Location'], str, 'Unknown'),
            'Status': safe_convert(row['Status'], str, 'Active'),
            'Description': safe_convert(row['Description'], str, ''),
            'VitalityDays': safe_convert(row.get('VitalityDays'), float, None),
            'Resistant': safe_convert(row.get('Resistant'), str, None),
            'IsAllergic': safe_convert(row.get('IsAllergic'), str, None)
        }
        
        # Add alerts
        product['alerts'] = {
            'lowStock': product['LowStock'],
            'nearExpiry': product['NearExpiry'],
            'expired': product['Expired']
        }
        
        return jsonify(product)
    
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/products", methods=["POST"])
def create_product():
    """Create a new product"""
    global inventory_df
    
    try:
        data = request.json
        
        # Generate ProductID if not provided
        product_id = data.get('ProductID', f"P{uuid.uuid4().hex[:8].upper()}")
        
        if product_id in inventory_df.index:
            return jsonify({'error': 'Product ID already exists'}), 400
        
        # Validate required fields
        required_fields = ['Name', 'Price', 'CategoryID']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {missing_fields}'}), 400
        
        # Set defaults for optional fields
        defaults = {
            'Category': 'General',
            'Quantity': 0,
            'MinQuantity': 10,
            'SupplierID': 'SUP001',
            'Barcode': f'{uuid.uuid4().hex[:12]}',
            'Location': 'A1-01',
            'Status': 'Active',
            'Description': f'High-quality {data["Name"]}',
            'ExpiryDate': None
        }
        
        # Merge data with defaults
        for key, default_value in defaults.items():
            if key not in data:
                data[key] = default_value
        
        # Create new product series
        new_product = pd.Series(data, name=product_id)
        
        # Calculate derived fields
        new_product['TotalValue'] = new_product['Quantity'] * new_product['Price']
        new_product['LowStock'] = new_product['Quantity'] <= new_product['MinQuantity']
        
        # Handle expiry date
        if data.get('ExpiryDate'):
            try:
                expiry_date = pd.to_datetime(data['ExpiryDate'])
                days_to_expiry = (expiry_date - datetime.now()).days
                new_product['DaysToExpiry'] = days_to_expiry
                new_product['NearExpiry'] = days_to_expiry <= 7 and days_to_expiry > 0
                new_product['Expired'] = days_to_expiry < 0
            except:
                new_product['DaysToExpiry'] = None
                new_product['NearExpiry'] = False
                new_product['Expired'] = False
        else:
            new_product['DaysToExpiry'] = None
            new_product['NearExpiry'] = False
            new_product['Expired'] = False
        
        # Add to inventory
        inventory_df = pd.concat([inventory_df, new_product.to_frame().T])
        
        # Save data
        save_inventory_data(inventory_df)
        
        # Log activity
        log_activity('product_created', product_id, {'name': data['Name']})
        
        return jsonify({
            'message': 'Product created successfully',
            'product_id': product_id,
            'product': new_product.to_dict()
        }), 201
    
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    """Update an existing product"""
    global inventory_df
    
    try:
        if product_id not in inventory_df.index:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.json
        
        # Update fields
        for key, value in data.items():
            if key != 'ProductID':  # Don't allow changing ProductID
                inventory_df.loc[product_id, key] = value
        
        # Recalculate derived fields
        if 'Quantity' in data or 'Price' in data:
            inventory_df.loc[product_id, 'TotalValue'] = (
                inventory_df.loc[product_id, 'Quantity'] * 
                inventory_df.loc[product_id, 'Price']
            )
        
        if 'Quantity' in data or 'MinQuantity' in data:
            inventory_df.loc[product_id, 'LowStock'] = (
                inventory_df.loc[product_id, 'Quantity'] <= 
                inventory_df.loc[product_id, 'MinQuantity']
            )
        
        if 'ExpiryDate' in data:
            if data['ExpiryDate']:
                try:
                    expiry_date = pd.to_datetime(data['ExpiryDate'])
                    days_to_expiry = (expiry_date - datetime.now()).days
                    inventory_df.loc[product_id, 'DaysToExpiry'] = days_to_expiry
                    inventory_df.loc[product_id, 'NearExpiry'] = days_to_expiry <= 7 and days_to_expiry > 0
                    inventory_df.loc[product_id, 'Expired'] = days_to_expiry < 0
                except:
                    inventory_df.loc[product_id, 'DaysToExpiry'] = None
                    inventory_df.loc[product_id, 'NearExpiry'] = False
                    inventory_df.loc[product_id, 'Expired'] = False
            else:
                inventory_df.loc[product_id, 'DaysToExpiry'] = None
                inventory_df.loc[product_id, 'NearExpiry'] = False
                inventory_df.loc[product_id, 'Expired'] = False
        
        # Save data
        save_inventory_data(inventory_df)
        
        # Log activity
        log_activity('product_updated', product_id, data)
        
        updated_product = inventory_df.loc[product_id].to_dict()
        updated_product['ProductID'] = product_id
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': updated_product
        })
    
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    """Delete a product"""
    global inventory_df
    
    try:
        if product_id not in inventory_df.index:
            return jsonify({'error': 'Product not found'}), 404
        
        product_name = inventory_df.loc[product_id, 'Name']
        
        # Remove product
        inventory_df = inventory_df.drop(product_id)
        
        # Save data
        save_inventory_data(inventory_df)
        
        # Log activity
        log_activity('product_deleted', product_id, {'name': product_name})
        
        return jsonify({'message': 'Product deleted successfully'})
    
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        return jsonify({'error': str(e)}), 500

# --------------------------------------------------
# Stock Management Endpoints
# --------------------------------------------------

@app.route("/api/products/<product_id>/stock", methods=["PUT"])
def update_stock(product_id):
    """Update stock quantity for a product"""
    global inventory_df
    
    try:
        if product_id not in inventory_df.index:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.json
        new_quantity = data.get('quantity')
        movement_type = data.get('type', 'adjustment')
        reason = data.get('reason', '')
        
        if new_quantity is None:
            return jsonify({'error': 'Quantity is required'}), 400
        
        old_quantity = inventory_df.loc[product_id, 'Quantity']
        
        # Update quantity
        inventory_df.loc[product_id, 'Quantity'] = new_quantity
        
        # Recalculate derived fields
        inventory_df.loc[product_id, 'TotalValue'] = (
            new_quantity * inventory_df.loc[product_id, 'Price']
        )
        inventory_df.loc[product_id, 'LowStock'] = (
            new_quantity <= inventory_df.loc[product_id, 'MinQuantity']
        )
        
        # Record movement
        movement_data = {
            'ProductID': product_id,
            'Type': movement_type,
            'PreviousQuantity': old_quantity,
            'NewQuantity': new_quantity,
            'Change': new_quantity - old_quantity,
            'Reason': reason,
            'Timestamp': datetime.now().isoformat(),
            'User': request.json.get('user', 'system')
        }
        
        # Save movement to file
        df_movement = pd.DataFrame([movement_data])
        if MOVEMENTS_PATH.exists():
            df_existing = pd.read_csv(MOVEMENTS_PATH)
            df_movement = pd.concat([df_existing, df_movement], ignore_index=True)
        df_movement.to_csv(MOVEMENTS_PATH, index=False)
        
        # Save inventory data
        save_inventory_data(inventory_df)
        
        # Log activity
        log_activity('stock_updated', product_id, {
            'old_quantity': old_quantity,
            'new_quantity': new_quantity,
            'type': movement_type
        })
        
        return jsonify({
            'message': 'Stock updated successfully',
            'previous_quantity': old_quantity,
            'new_quantity': new_quantity,
            'change': new_quantity - old_quantity
        })
    
    except Exception as e:
        logger.error(f"Error updating stock for {product_id}: {e}")
        return jsonify({'error': str(e)}), 500

# --------------------------------------------------
# Analytics & Dashboard Endpoints
# --------------------------------------------------

@app.route("/api/analytics/dashboard", methods=["GET"])
def get_dashboard_data():
    """Get dashboard summary data"""
    try:
        total_products = len(inventory_df)
        total_value = inventory_df['TotalValue'].sum()
        low_stock_count = inventory_df['LowStock'].sum()
        expiring_count = inventory_df['NearExpiry'].sum()
        expired_count = inventory_df['Expired'].sum()
        
        # Category breakdown
        category_stats = inventory_df.groupby('CategoryID').agg({
            'Quantity': 'sum',
            'TotalValue': 'sum',
            'Category': 'first'
        }).to_dict(orient='index')
        
        # Top products by value
        top_products = inventory_df.nlargest(5, 'TotalValue')[['Name', 'TotalValue']].reset_index()
        top_products_list = top_products.to_dict(orient='records')
        
        return jsonify({
            'summary': {
                'totalProducts': int(total_products),
                'totalValue': float(total_value),
                'lowStockCount': int(low_stock_count),
                'expiringCount': int(expiring_count),
                'expiredCount': int(expired_count)
            },
            'categoryStats': category_stats,
            'topProducts': top_products_list,
            'lastUpdated': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Get all product categories"""
    try:
        categories = inventory_df.groupby('CategoryID').agg({
            'Name': 'count',
            'TotalValue': 'sum',
            'Category': 'first'
        }).rename(columns={'Name': 'ProductCount'})
        
        categories_list = []
        for category_id, data in categories.iterrows():
            categories_list.append({
                'CategoryID': str(category_id),
                'Name': data.get('Category', str(category_id)),
                'ProductCount': int(data['ProductCount']),
                'TotalValue': float(data['TotalValue'])
            })
        
        return jsonify({'categories': categories_list})
    
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/alerts/low-stock", methods=["GET"])
def get_low_stock_alerts():
    """Get products with low stock levels"""
    try:
        low_stock_products = inventory_df[inventory_df['LowStock'] == True]
        
        alerts = []
        for product_id, product in low_stock_products.iterrows():
            alerts.append({
                'ProductID': product_id,
                'Name': product['Name'],
                'CurrentQuantity': int(product['Quantity']),
                'MinQuantity': int(product['MinQuantity']),
                'Category': product.get('Category', 'Unknown'),
                'Severity': 'high' if product['Quantity'] == 0 else 'medium',
                'Message': f"{product['Name']} is running low on stock"
            })
        
        return jsonify({
            'alerts': alerts,
            'count': len(alerts)
        })
    
    except Exception as e:
        logger.error(f"Error fetching low stock alerts: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/alerts/expiring", methods=["GET"])
def get_expiring_alerts():
    """Get products expiring soon"""
    try:
        days_threshold = int(request.args.get('days', 7))
        expiring_products = inventory_df[
            (inventory_df['DaysToExpiry'] <= days_threshold) & 
            (inventory_df['DaysToExpiry'] > 0)
        ].sort_values('DaysToExpiry')
        
        alerts = []
        for product_id, product in expiring_products.iterrows():
            days_left = product['DaysToExpiry']
            severity = 'high' if days_left <= 3 else 'medium' if days_left <= 7 else 'low'
            
            alerts.append({
                'ProductID': product_id,
                'Name': product['Name'],
                'ExpiryDate': safe_date_str(product.get('ExpiryDate')),
                'DaysToExpiry': int(days_left),
                'Quantity': int(product['Quantity']),
                'Severity': severity,
                'Message': f"{product['Name']} expires in {days_left} days"
            })
        
        return jsonify({
            'alerts': alerts,
            'count': len(alerts)
        })
    
    except Exception as e:
        logger.error(f"Error fetching expiring alerts: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/refresh", methods=["POST"])
def refresh_data():
    """Reload inventory data from CSV"""
    global inventory_df
    
    try:
        inventory_df = load_inventory_data()
        
        log_activity('data_refreshed', details={'num_products': len(inventory_df)})
        
        return jsonify({
            'message': 'Data refreshed successfully',
            'productCount': len(inventory_df),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error refreshing data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route("/api/health", methods=["GET"])
def health_check():
    """System health check"""
    try:
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'productCount': len(inventory_df),
            'dataFile': str(DATA_PATH),
            'dataFileExists': DATA_PATH.exists()
        })
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# --------------------------------------------------
# Error Handlers
# --------------------------------------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# --------------------------------------------------
# Main Entry Point
# --------------------------------------------------

if __name__ == "__main__":
    logger.info("Starting Inventory Management API...")
    logger.info(f"Data file: {DATA_PATH}")
    logger.info(f"Products loaded: {len(inventory_df)}")
    
    if len(inventory_df) > 0:
        logger.info("Sample product data:")
        logger.info(f"Columns: {list(inventory_df.columns)}")
        logger.info(f"First product: {inventory_df.iloc[0]['Name']}")
        logger.info(f"Categories: {inventory_df['CategoryID'].unique()}")
    
    # Run on port 5001
    app.run(debug=True, host='127.0.0.1', port=5001)