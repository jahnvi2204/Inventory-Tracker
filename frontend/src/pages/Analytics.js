// src/pages/Analytics.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Psychology,
  Timeline,
  PieChart,
  BarChart,
  AutoGraph,
  Download,
  DateRange,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import api from '../services/api';

const Analytics = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { products } = useSelector((state) => state.inventory);
  const { theme } = useSelector((state) => state.settings);

  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(30, 'days'),
    endDate: dayjs(),
  });
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    fetchAnalytics();
    generateAIInsights();
  }, [dateRange, products]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/data', {
        params: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        },
      });
      // Process analytics data
    } catch (error) {
      enqueueSnackbar('Error fetching analytics', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    // Simulate AI analysis
    const insights = [];

    // Analyze stock trends
    const lowStockItems = products.filter(p => p.alerts?.lowStock);
    if (lowStockItems.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Low Stock Alert',
        description: `${lowStockItems.length} products are running low. Consider reordering soon.`,
        action: 'View Low Stock Items',
        priority: 'high',
      });
    }

    // Analyze expiry patterns
    const expiringItems = products.filter(p => p.alerts?.nearExpiry);
    if (expiringItems.length > 0) {
      insights.push({
        type: 'alert',
        title: 'Expiry Management',
        description: `${expiringItems.length} products expiring within 30 days. Consider promotions or donations.`,
        action: 'Manage Expiring Items',
        priority: 'high',
      });
    }

    // Analyze sales velocity
    const fastMoving = products.filter(p => {
      // Simulate fast-moving calculation based on quantity changes
      return p.quantity < p.minQuantity * 2;
    });
    
    if (fastMoving.length > 0) {
      insights.push({
        type: 'success',
        title: 'Fast-Moving Products',
        description: `${fastMoving.length} products are selling quickly. Ensure adequate stock levels.`,
        action: 'Analyze Trends',
        priority: 'medium',
      });
    }

    // Category optimization
    const categories = [...new Set(products.map(p => p.category))];
    const categoryStats = categories.map(cat => ({
      category: cat,
      count: products.filter(p => p.category === cat).length,
      value: products.filter(p => p.category === cat).reduce((sum, p) => sum + (p.quantity * p.price.selling), 0),
    }));

    const topCategory = categoryStats.sort((a, b) => b.value - a.value)[0];
    insights.push({
      type: 'info',
      title: 'Category Performance',
      description: `"${topCategory.category}" is your top-performing category with ${topCategory.value.toLocaleString()} in inventory value.`,
      action: 'View Category Analysis',
      priority: 'low',
    });

    // Seasonal trends
    insights.push({
      type: 'suggestion',
      title: 'Seasonal Opportunity',
      description: 'Based on historical data, consider stocking up on seasonal items for the upcoming period.',
      action: 'View Seasonal Trends',
      priority: 'medium',
    });

    setAiInsights(insights);

    // Generate predictions
    generatePredictions();
  };

  const generatePredictions = () => {
    // Simulate AI predictions
    const predictions = {
      stockout: products.filter(p => p.quantity <= p.minQuantity).map(p => ({
        product: p.name,
        daysUntilStockout: Math.max(1, Math.floor(p.quantity / 2)),
        recommendedOrder: p.minQuantity * 3,
      })).slice(0, 5),
      demand: {
        nextWeek: Math.floor(Math.random() * 20) + 80,
        nextMonth: Math.floor(Math.random() * 30) + 70,
      },
      revenue: {
        projected: products.reduce((sum, p) => sum + (p.quantity * p.price.selling * 0.7), 0),
        growth: Math.floor(Math.random() * 15) + 5,
      },
    };
    setPredictions(predictions);
  };

  // Chart configurations
  const inventoryTurnoverChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inventory Turnover Ratio',
        data: [2.5, 2.8, 3.1, 2.9, 3.3, 3.5],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const demandForecastChart = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Predicted Demand',
        data: [85, 92, 88, 95],
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
        borderWidth: 2,
        type: 'line',
        tension: 0.3,
      },
      {
        label: 'Actual Demand',
        data: [80, 90, 85, null],
        backgroundColor: 'rgba(255, 152, 0, 0.6)',
        borderColor: '#f57c00',
        borderWidth: 2,
      },
    ],
  };

  const categoryPerformanceChart = {
    labels: [...new Set(products.map(p => p.category))].slice(0, 6),
    datasets: [
      {
        label: 'Revenue by Category',
        data: [45000, 38000, 32000, 28000, 25000, 20000],
        backgroundColor: [
          '#1976d2',
          '#388e3c',
          '#d32f2f',
          '#f57c00',
          '#7b1fa2',
          '#0288d1',
        ],
      },
    ],
  };

  const InsightCard = ({ insight }) => {
    const getIcon = () => {
      switch (insight.type) {
        case 'warning':
          return <TrendingDown color="warning" />;
        case 'alert':
          return <Timeline color="error" />;
        case 'success':
          return <TrendingUp color="success" />;
        case 'suggestion':
          return <Lightbulb color="primary" />;
        default:
          return <Psychology color="info" />;
      }
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box sx={{ mr: 2 }}>{getIcon()}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {insight.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {insight.description}
              </Typography>
              <Button size="small" variant="outlined">
                {insight.action}
              </Button>
            </Box>
            <Chip
              label={insight.priority}
              size="small"
              color={
                insight.priority === 'high' ? 'error' :
                insight.priority === 'medium' ? 'warning' : 'default'
              }
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          AI-Powered Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => enqueueSnackbar('Exporting analytics report...', { variant: 'info' })}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {/* AI Insights Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ mr: 1 }} />
              <Typography variant="h6">AI Insights</Typography>
            </Box>
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              {aiInsights.map((insight, index) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Inventory Turnover */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Inventory Turnover Trend
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={inventoryTurnoverChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Ratio: ${context.parsed.y}x`,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Demand Forecast */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Demand Forecast
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Bar
                    data={demandForecastChart}
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

            {/* Category Performance */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Category Performance
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Doughnut
                    data={categoryPerformanceChart}
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
          </Grid>
        </Grid>

        {/* Predictions Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Predictions & Recommendations
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Stockout Predictions
                    </Typography>
                    <List dense>
                      {predictions.stockout?.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={item.product}
                            secondary={`Stockout in ${item.daysUntilStockout} days`}
                          />
                          <Chip
                            label={`Order ${item.recommendedOrder}`}
                            size="small"
                            color="warning"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Demand Forecast
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Next Week: <strong>{predictions.demand?.nextWeek}%</strong> of current capacity
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={predictions.demand?.nextWeek || 0}
                        sx={{ mt: 1, mb: 2 }}
                      />
                      <Typography variant="body2">
                        Next Month: <strong>{predictions.demand?.nextMonth}%</strong> of current capacity
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={predictions.demand?.nextMonth || 0}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Revenue Projection
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h4" color="primary">
                        ${predictions.revenue?.projected?.toLocaleString() || '0'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUp color="success" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="success.main">
                          +{predictions.revenue?.growth || 0}% growth expected
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;