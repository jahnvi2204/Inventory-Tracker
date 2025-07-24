# 📦 Inventory Management System

A comprehensive inventory management system built with React frontend and Node.js backend, featuring real-time product tracking, analytics, and user management with Google OAuth authentication.

## 🌟 Features

### 📊 **Dashboard**
- Real-time inventory overview with key metrics
- Interactive charts showing inventory trends and category distribution
- Stock level visualization with current vs minimum quantities
- Low stock and expiry alerts with visual indicators
- Recent activity tracking

### 📋 **Inventory Management**
- Complete product catalog with advanced search and filtering
- Real-time stock level monitoring with color-coded status indicators
- Category-based organization and filtering
- Expiry date tracking with automated alerts
- Pagination support for large inventories
- Bulk operations and product management

### 📈 **Analytics & Insights**
- Comprehensive analytics dashboard with multiple chart types
- Category distribution analysis (by value and quantity)
- Stock level analysis (adequate, low, critical)
- Expiry status tracking (fresh, near expiry, expired)
- Time-based trend analysis with customizable date ranges
- Key performance indicators and metrics

### 👥 **User Management**
- Google OAuth 2.0 authentication with session management
- Role-based access control (Admin, Manager, Staff, Operator, Viewer)
- Organization-based user isolation
- User activity tracking and audit logs
- Invitation system for new users

### 🔔 **Real-time Features**
- Socket.io integration for real-time updates
- Live notifications for stock changes
- Automatic session management and renewal
- Real-time collaboration features

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Comprehensive component library
- **Redux Toolkit** - State management with modern Redux patterns
- **Chart.js with react-chartjs-2** - Interactive data visualization
- **Axios** - HTTP client with interceptors and session management
- **Day.js** - Lightweight date manipulation
- **Socket.io Client** - Real-time communication

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Passport.js** - Authentication middleware with Google OAuth
- **MongoDB with Mongoose** - Database and ODM
- **Socket.io** - Real-time bidirectional communication
- **Express Session** - Session management
- **Python API Integration** - Microservice architecture

### **Authentication & Security**
- **Google OAuth 2.0** - Secure authentication flow
- **Session-based Authentication** - Server-side session management
- **CORS Configuration** - Cross-origin resource sharing
- **Role-based Authorization** - Granular permission system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Google OAuth credentials
- Python API service running on port 5001

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   
   Create `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/inventory-management
   
   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # API Configuration
   PORT=5000
   CLIENT_URL=http://localhost:3001
   PYTHON_API_URL=http://localhost:5001
   
   # Environment
   NODE_ENV=development
   ```

   Create `.env` file in the client directory:
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   
   # OAuth Configuration (optional for frontend)
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

5. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

6. **Start the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   npm run dev
   ```
   
   **Or start separately:**
   
   Backend:
   ```bash
   npm start
   ```
   
   Frontend:
   ```bash
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000
   - Socket.io: ws://localhost:5000

## 📁 Project Structure

```
inventory-management-system/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── Layout/            # Application layout components
│   │   │   ├── PrivateRoute.js    # Protected route component
│   │   │   └── ...
│   │   ├── pages/                 # Main application pages
│   │   │   ├── Dashboard.js       # Main dashboard with analytics
│   │   │   ├── Inventory.js       # Product inventory management
│   │   │   ├── Analytics.js       # Advanced analytics and insights
│   │   │   ├── Login.js           # Authentication page
│   │   │   ├── Users.js           # User management
│   │   │   └── ...
│   │   ├── store/                 # Redux store configuration
│   │   │   ├── index.js           # Store setup
│   │   │   └── slices/            # Redux slices
│   │   │       ├── authSlice.js   # Authentication state
│   │   │       ├── dashboardSlice.js
│   │   │       ├── inventorySlice.js
│   │   │       └── ...
│   │   ├── services/              # API services
│   │   │   ├── api.js             # Axios configuration
│   │   │   └── ...
│   │   ├── socket/                # Socket.io configuration
│   │   ├── context/               # React contexts
│   │   ├── utils/                 # Utility functions
│   │   └── App.js                 # Main application component
│   ├── package.json
│   └── ...
├── routes/                        # Express route handlers
│   ├── auth.js                    # Authentication routes
│   ├── products.js                # Product management routes
│   ├── inventory.js               # Inventory routes
│   ├── analytics.js               # Analytics routes
│   ├── users.js                   # User management routes
│   └── dashboard.js               # Dashboard routes
├── models/                        # Mongoose models
│   ├── User.js                    # User model
│   ├── Product.js                 # Product model
│   ├── Organization.js            # Organization model
│   └── ...
├── middleware/                    # Express middleware
│   ├── auth.js                    # Authentication middleware
│   ├── cors.js                    # CORS configuration
│   └── ...
├── config/                        # Configuration files
│   ├── database.js                # Database connection
│   ├── passport.js                # Passport configuration
│   └── ...
├── socket/                        # Socket.io configuration
├── utils/                         # Utility functions
├── server.js                      # Express server entry point
├── package.json
└── README.md
```

## 🔐 Authentication Flow

### Google OAuth 2.0 Integration

1. **User initiates login** by clicking "Sign in with Google"
2. **Redirect to Google** OAuth authorization server
3. **User grants permission** to access profile information
4. **Google redirects back** with authorization code
5. **Backend exchanges code** for access token and user profile
6. **Session is created** and user is authenticated
7. **Frontend receives authentication** status and user data

### Session Management

- **Session-based authentication** using Express sessions
- **Automatic session renewal** on API requests
- **Secure session cookies** with httpOnly and sameSite settings
- **Session persistence** across browser refreshes
- **Automatic logout** on session expiration

## 📊 Data Flow Architecture

### Frontend to Backend Communication

```
React Components
     ↓
Redux Actions
     ↓
API Service (Axios)
     ↓
Express Routes
     ↓
Middleware (Auth/CORS)
     ↓
Route Handlers
     ↓
Python API / Database
```

### Real-time Updates

```
Frontend (Socket.io Client)
     ↕
Backend (Socket.io Server)
     ↕
Database Change Events
```

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/status` - Check authentication status
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback handler
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Products & Inventory
- `GET /api/products` - Get all products with filtering
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/inventory/alerts/low-stock` - Get low stock alerts
- `GET /api/inventory/alerts/expiring` - Get expiring products

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/dashboard/stats` - Get dashboard statistics

### User Management
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create/invite new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 UI Components & Features

### Dashboard Features
- **Real-time metrics** with auto-refresh
- **Interactive charts** using Chart.js
- **Status indicators** with color coding
- **Responsive grid layout** with Material-UI
- **Quick actions** and navigation

### Inventory Management
- **Advanced filtering** by category, status, stock level
- **Search functionality** across product names, barcodes, locations
- **Sortable tables** with pagination
- **Bulk operations** support
- **Status badges** for quick visual identification

### Analytics Dashboard
- **Multiple chart types** (Line, Bar, Doughnut, Pie)
- **Time range selection** (7, 30, 90 days)
- **Category analysis** with value and quantity breakdowns
- **Stock level insights** with actionable recommendations
- **Expiry tracking** with automated alerts

## 🔒 Security Features

### Authentication Security
- **OAuth 2.0 implementation** with Google
- **Session security** with secure cookies
- **CSRF protection** with sameSite cookie settings
- **Session timeout** and automatic renewal

### Authorization
- **Role-based access control** with granular permissions
- **Organization isolation** for multi-tenant support
- **Route protection** with middleware
- **API endpoint authorization** checks

### Data Security
- **Input validation** and sanitization
- **SQL injection prevention** with parameterized queries
- **XSS protection** with Content Security Policy
- **Secure headers** configuration

## 🚀 Deployment

### Environment Setup

**Production environment variables:**
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
SESSION_SECRET=your-super-secure-production-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
CLIENT_URL=https://your-production-domain.com
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Production Considerations

- **Environment variables** management with secrets
- **Database connection** pooling and optimization
- **Load balancing** for multiple instances
- **SSL/TLS encryption** for secure communication
- **Monitoring and logging** setup
- **Backup strategies** for data protection

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm test
```

### Backend Testing
```bash
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📈 Performance Optimization

### Frontend Optimizations
- **Code splitting** with React.lazy()
- **Memoization** with React.memo and useMemo
- **Virtual scrolling** for large datasets
- **Image optimization** and lazy loading
- **Bundle size optimization** with webpack

### Backend Optimizations
- **Database indexing** for query performance
- **Connection pooling** for database efficiency
- **Caching strategies** with Redis
- **API response compression** with gzip
- **Rate limiting** for API protection

## 🐛 Troubleshooting

### Common Issues

**Authentication Issues:**
- Verify Google OAuth credentials
- Check redirect URI configuration
- Ensure CORS settings allow credentials
- Verify session configuration

**Connection Issues:**
- Check if backend server is running on port 5000
- Verify MongoDB connection
- Check if Python API is running on port 5001
- Verify firewall and network settings

**Data Loading Issues:**
- Check API endpoint availability
- Verify authentication status
- Check browser console for errors
- Verify database connectivity

### Debug Mode

Enable debug logging:
```env
DEBUG=inventory:*
NODE_ENV=development
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- **Code Style:** Follow ESLint configuration
- **Commit Messages:** Use conventional commit format
- **Testing:** Add tests for new features
- **Documentation:** Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React, Redux, Material-UI
- **Backend Development** - Node.js, Express, MongoDB
- **Authentication** - Google OAuth, Session Management
- **Analytics** - Chart.js, Data Visualization
- **DevOps** - Docker, Deployment, Monitoring

## 🆘 Support

For support and questions:
- **GitHub Issues** - Report bugs and feature requests
- **Documentation** - Check the wiki for detailed guides
- **Community** - Join our discussion forums

## 🗺️ Roadmap

### Short Term
- [ ] Advanced reporting features
- [ ] Mobile app development
- [ ] API rate limiting
- [ ] Enhanced security features

### Medium Term
- [ ] Multi-language support
- [ ] Advanced analytics with ML
- [ ] Integration with external systems
- [ ] Automated testing suite

### Long Term
- [ ] Microservices architecture
- [ ] Advanced AI features
- [ ] IoT device integration
- [ ] Enterprise-grade features

---

**Built with ❤️ by the Inventory Management Team**
