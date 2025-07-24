// src/App.js - Fixed version
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './store'; // Make sure this path matches your store file
import { useSelector, useDispatch } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import { ThemeProviderCustom, useThemeMode } from './context/ThemeContext';

// Components
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Scanner from './pages/Scanner';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Users from './pages/Users';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';

// Actions - FIXED: Import the correct action name
import { checkAuthStatus } from './store/slices/authSlice';

// Add import for socket module
import socket from './socket';

// API cleanup


function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, initialized } = useSelector((state) => state.auth);
  const { darkMode } = useThemeMode();
  
  // Refs to prevent duplicate operations
  const socketConnectedRef = useRef(false);
  const authCheckedRef = useRef(false);

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#9c27b0', // Purple
          },
          secondary: {
            main: '#7c4dff', // Deep purple accent
          },
          background: {
            default: darkMode ? '#0a0a0a' : '#fafafa',
            paper: darkMode ? '#181028' : '#fff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  // Initial auth check with stability
  useEffect(() => {
    if (!initialized && !authCheckedRef.current) {
      authCheckedRef.current = true;
      console.log('🔍 Checking initial auth status...');
      
      // Add delay to prevent React StrictMode double-execution issues
      const timer = setTimeout(() => {
        dispatch(checkAuthStatus());
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dispatch, initialized]);

  // Socket connection management with stability
  useEffect(() => {
    if (isAuthenticated && user?.organization && !socketConnectedRef.current) {
      socketConnectedRef.current = true;
      console.log('🔌 Setting up socket connection...');
      
      const setupSocket = () => {
        if (!socket.connected) {
          socket.connect();
        }
        
        const handleConnect = () => {
          console.log('✅ Socket connected to server');
          socket.emit('join-organization', user.organization);
        };
        
        const handleDisconnect = () => {
          console.log('❌ Socket disconnected from server');
          socketConnectedRef.current = false;
        };
        
        const handleConnectError = (error) => {
          console.error('🔌 Socket connection error:', error?.message || error);
          socketConnectedRef.current = false;
        };
        
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        
        // If already connected, join organization immediately
        if (socket.connected) {
          handleConnect();
        }
      };
      
      // Delay to prevent rapid reconnections and reduce timeout errors
      const timer = setTimeout(setupSocket, 2000); // Increased delay
      
      return () => {
        clearTimeout(timer);
        console.log('🧹 Cleaning up socket connections...');
        
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        
        if (socket.connected) {
          socket.disconnect();
        }
        socketConnectedRef.current = false;
      };
    }
    
    // If not authenticated but socket was connected, clean up
    if (!isAuthenticated && socketConnectedRef.current) {
      console.log('🔌 User not authenticated, disconnecting socket...');
      
      if (socket.connected) {
        socket.disconnect();
      }
      socketConnectedRef.current = false;
    }
    
    return () => {}; // Always return cleanup function
  }, [isAuthenticated, user?.organization]);

  // Global cleanup on app unmount
  useEffect(() => {
    return () => {
     
      
      if (socket.connected) {
        socket.disconnect();
      }
      socketConnectedRef.current = false;
      authCheckedRef.current = false;
    };
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login signupMode />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory/:id" element={<ProductDetail />} />
                <Route path="scanner" element={<Scanner />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<Users />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProviderCustom>
        <AppContent />
      </ThemeProviderCustom>
    </Provider>
  );
}

export default App;