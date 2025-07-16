// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Inventory2,
  Warning,
  TrendingUp,
  TrendingDown,
  EventNote,
  LocalShipping,
  AttachMoney,
  Refresh,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import { fetchProducts } from '../store/slices/inventorySlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  // Defensive Redux state selectors
  const { user = {} } = useSelector((state) => state.auth || {});
  const { stats = {}, recentActivity = [], loading = false } = useSelector((state) => state.dashboard || {});
  const { products = [] } = useSelector((state) => state.inventory || {});
  const { theme = 'light' } = useSelector((state) => state.settings || {});

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchDashboardData()),
      dispatch(fetchProducts({ limit: 100 })),
    ]);
    setRefreshing(false);
  };

  // Defensive calculations
  const totalProducts = Array.isArray(products) ? products.length : 0;
  const lowStockProducts = Array.isArray(products) ? products.filter(p => p?.alerts?.lowStock).length : 0;
  const expiringProducts = Array.isArray(products) ? products.filter(p => p?.alerts?.nearExpiry).length : 0;
  const totalValue = Array.isArray(products) ? products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price?.selling || 0)), 0) : 0;

  // Chart data for inventory value over time
  const inventoryValueChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inventory Value',
        data: [45000, 52000, 48000, 61000, 58000, 65000],
        borderColor: theme === 'dark' ? '#90caf9' : '#1976d2',
        backgroundColor: theme === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Chart data for category distribution
  const categoryDistribution = {
    labels: ['Electronics', 'Food & Beverages', 'Healthcare', 'Clothing', 'Others'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#1976d2',
          '#43a047',
          '#e53935',
          '#fb8c00',
          '#8e24aa',
        ],
      },
    ],
  };

  // Defensive chart data
  const stockLevelsChart = {
    labels: Array.isArray(products) ? products.slice(0, 10).map(p => (p.name ? p.name.substring(0, 15) + '...' : '')) : [],
    datasets: [
      {
        label: 'Current Stock',
        data: Array.isArray(products) ? products.slice(0, 10).map(p => p.quantity || 0) : [],
        backgroundColor: theme === 'dark' ? '#66bb6a' : '#43a047',
      },
      {
        label: 'Min Stock',
        data: Array.isArray(products) ? products.slice(0, 10).map(p => p.minQuantity || 0) : [],
        backgroundColor: theme === 'dark' ? '#ef5350' : '#e53935',
      },
    ],
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend > 0 ? (
                  <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(trend)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Here's your inventory overview.
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={loadDashboardData} disabled={refreshing}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory2 sx={{ color: 'primary.main' }} />}
            color="primary"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={lowStockProducts}
            icon={<Warning sx={{ color: 'warning.main' }} />}
            color="warning"
            trend={-5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expiring Soon"
            value={expiringProducts}
            icon={<EventNote sx={{ color: 'error.main' }} />}
            color="error"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: 'success.main' }} />}
            color="success"
            trend={15}
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Inventory Value Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={inventoryValueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={categoryDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Stock Levels Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stock Levels
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={stockLevelsChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.slice(0, 5).map((activity, index) => (
                <ListItem key={index} divider={index < 4}>
                  <ListItemIcon>
                    {activity.type === 'addition' ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.description}
                    secondary={dayjs(activity.timestamp).format('DD/MM/YYYY HH:mm')}
                  />
                  <Chip
                    label={activity.user}
                    size="small"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="text">View All Activity</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alerts & Notifications
            </Typography>
            <Grid container spacing={2}>
              {lowStockProducts > 0 && (
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'warning.light',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Warning sx={{ mr: 2, color: 'warning.dark' }} />
                    <Box>
                      <Typography variant="subtitle1">Low Stock Alert</Typography>
                      <Typography variant="body2">
                        {lowStockProducts} products are running low on stock
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              {expiringProducts > 0 && (
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'error.light',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <EventNote sx={{ mr: 2, color: 'error.dark' }} />
                    <Box>
                      <Typography variant="subtitle1">Expiry Alert</Typography>
                      <Typography variant="body2">
                        {expiringProducts} products are expiring soon
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;