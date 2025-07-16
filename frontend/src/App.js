// src/App.js
import React, { useEffect } from 'react';
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

// Actions
import { checkAuth } from './store/slices/authSlice';

// Add import for socket module
import socket from './socket';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { darkMode } = useThemeMode();

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

 useEffect(() => {
  if (isAuthenticated && user?.organization) {
    // Use the socket instance from the module
    if (!socket.connected) {
      socket.connect();
    }
    
    const handleConnect = () => {
      console.log('Connected to server');
      socket.emit('join-organization', user.organization);
    };
    
    socket.on('connect', handleConnect);
    
    // Always return a cleanup function
    return () => {
      socket.off('connect', handleConnect);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }
  
  // Return empty cleanup function when condition is false
  return () => {};
}, [isAuthenticated, user]);
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