import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, IconButton, Tooltip } from '@mui/material';
import { Dashboard, Inventory2, BarChart, QrCodeScanner, People, Settings, Logout, Assessment, LightMode, DarkMode } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';

const drawerWidth = 220;

const navItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Inventory', icon: <Inventory2 />, path: '/inventory' },
  { text: 'Scanner', icon: <QrCodeScanner />, path: '/scanner' },
  { text: 'Analytics', icon: <BarChart />, path: '/analytics' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Users', icon: <People />, path: '/users' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Layout = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 60%, #2d0b4e 100%)' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #181028 80%, #9c27b0 100%)',
            color: '#fff',
            borderRight: 0,
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#fff' }}>
            Zero Inventory
          </Typography>
        </Toolbar>
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                color: location.pathname.startsWith(item.path) ? '#9c27b0' : '#fff',
                background: location.pathname.startsWith(item.path) ? 'rgba(156,39,176,0.08)' : 'none',
                borderRadius: 2,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <ListItem button sx={{ mt: 2, color: '#fff' }}>
            <ListItemIcon sx={{ color: 'inherit' }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <AppBar position="fixed" sx={{ zIndex: 1201, ml: `${drawerWidth}px`, background: 'rgba(44,0,80,0.95)' }} elevation={0}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
              {navItems.find((item) => location.pathname.startsWith(item.path))?.text || 'Zero Inventory'}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Toggle Theme">
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 