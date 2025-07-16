import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fab,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Radio,
  RadioGroup,
  FormGroup,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Assessment,
  Download,
  Upload,
  Share,
  Schedule,
  FilterList,
  Search,
  Refresh,
  Print,
  Email,
  CloudDownload,
  PictureAsPdf,
  TableChart,
  InsertChart,
  BarChart,
  PieChart,
  Timeline,
  TrendingUp,
  TrendingDown,
  Inventory,
  AttachMoney,
  LocalShipping,
  People,
  Category,
  DateRange,
  CalendarToday,
  Analytics,
  Psychology,
  AutoGraph,
  Speed,
  Visibility,
  VisibilityOff,
  Settings,
  Star,
  BookmarkBorder,
  Bookmark,
  FolderOpen,
  CreateNewFolder,
  ExpandMore,
  CheckCircle,
  Error,
  Warning,
  Info,
  LightMode,
  DarkMode,
  MoreVert,
  Edit,
  Delete,
  FileCopy,
  CloudQueue,
  GetApp,
  Business,
  ShowChart,
  DonutLarge,
  MultilineChart,
  ScatterPlot,
  Equalizer,
  Poll,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Chart Components (simplified for demo)
const Line = ({ data, options }) => (
  <Box sx={{ 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    bgcolor: 'background.paper',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider'
  }}>
    <Typography variant="body2" color="text.secondary">
      Line Chart: {data.datasets[0].label}
    </Typography>
  </Box>
);

const Bar = ({ data, options }) => (
  <Box sx={{ 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    bgcolor: 'background.paper',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider'
  }}>
    <Typography variant="body2" color="text.secondary">
      Bar Chart: {data.datasets[0].label}
    </Typography>
  </Box>
);

const Doughnut = ({ data, options }) => (
  <Box sx={{ 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    bgcolor: 'background.paper',
    borderRadius: 1,
    border: '1px solid',
    borderColor: 'divider'
  }}>
    <Typography variant="body2" color="text.secondary">
      Doughnut Chart
    </Typography>
  </Box>
);

// Date Picker Components (simplified)
const LocalizationProvider = ({ children }) => children;
const DatePicker = ({ label, value, onChange, renderInput }) => (
  <TextField
    label={label}
    value={value ? value.format('YYYY-MM-DD') : ''}
    onChange={(e) => onChange && onChange({ format: () => e.target.value })}
    type="date"
    fullWidth
    InputLabelProps={{ shrink: true }}
  />
);

const AdvancedReports = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedReport, setSelectedReport] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    start: { format: () => '2024-01-01' },
    end: { format: () => '2024-12-31' },
    preset: 'last30'
  });
  const [loading, setLoading] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [reportFilters, setReportFilters] = useState({
    categories: [],
    suppliers: [],
    status: 'all',
    includeImages: false,
    groupBy: 'category'
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#6366f1' },
      secondary: { main: '#ec4899' },
      background: {
        default: darkMode ? '#0f0f23' : '#f8fafc',
        paper: darkMode ? '#1a1a2e' : '#ffffff',
      },
      success: { main: '#10b981' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 12 },
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const reportTypes = [
    { 
      id: 'inventory', 
      name: 'Inventory Report', 
      icon: <Inventory />, 
      description: 'Current stock levels, valuations, and movement analysis',
      category: 'Operational',
      lastGenerated: '2 hours ago',
      size: '2.3 MB',
      formats: ['PDF', 'Excel', 'CSV']
    },
    { 
      id: 'sales', 
      name: 'Sales Analytics', 
      icon: <TrendingUp />, 
      description: 'Sales performance, trends, and revenue analysis',
      category: 'Financial',
      lastGenerated: '1 day ago',
      size: '4.1 MB',
      formats: ['PDF', 'Excel', 'PowerPoint']
    },
    { 
      id: 'purchase', 
      name: 'Purchase Orders', 
      icon: <LocalShipping />, 
      description: 'Supplier analysis, purchase patterns, and cost optimization',
      category: 'Procurement',
      lastGenerated: '3 hours ago',
      size: '1.8 MB',
      formats: ['PDF', 'Excel', 'CSV']
    },
    { 
      id: 'profit', 
      name: 'Profit & Loss', 
      icon: <AttachMoney />, 
      description: 'Comprehensive P&L analysis with margin breakdown',
      category: 'Financial',
      lastGenerated: '6 hours ago',
      size: '3.2 MB',
      formats: ['PDF', 'Excel']
    },
    { 
      id: 'audit', 
      name: 'Audit Trail', 
      icon: <Assessment />, 
      description: 'Complete transaction history and compliance reporting',
      category: 'Compliance',
      lastGenerated: '12 hours ago',
      size: '5.7 MB',
      formats: ['PDF', 'CSV', 'JSON']
    },
    { 
      id: 'analytics', 
      name: 'AI Insights', 
      icon: <Psychology />, 
      description: 'Machine learning powered insights and predictions',
      category: 'Intelligence',
      lastGenerated: '30 min ago',
      size: '2.9 MB',
      formats: ['PDF', 'Interactive Dashboard']
    },
  ];

  const scheduledReports = [
    {
      id: 1,
      name: 'Daily Inventory Summary',
      type: 'inventory',
      schedule: 'Daily at 9:00 AM',
      recipients: ['manager@company.com', 'inventory@company.com'],
      format: 'PDF',
      status: 'active',
      nextRun: 'Tomorrow at 9:00 AM'
    },
    {
      id: 2,
      name: 'Weekly Sales Report',
      type: 'sales',
      schedule: 'Every Monday at 8:00 AM',
      recipients: ['sales@company.com', 'ceo@company.com'],
      format: 'Excel',
      status: 'active',
      nextRun: 'Monday at 8:00 AM'
    },
    {
      id: 3,
      name: 'Monthly P&L Report',
      type: 'profit',
      schedule: '1st of every month',
      recipients: ['finance@company.com'],
      format: 'PDF',
      status: 'paused',
      nextRun: 'Paused'
    }
  ];

  const sampleData = {
    inventory: {
      totalItems: 1247,
      totalValue: 2847392,
      lowStockItems: 23,
      outOfStock: 7,
      categories: 12,
      averageTurnover: 3.2,
      topCategories: [
        { name: 'Electronics', value: 45, items: 234 },
        { name: 'Clothing', value: 28, items: 189 },
        { name: 'Home & Garden', value: 15, items: 156 },
        { name: 'Sports', value: 12, items: 98 }
      ]
    },
    sales: {
      totalRevenue: 2847392,
      totalOrders: 3247,
      averageOrderValue: 877,
      growthRate: 18.5,
      topProducts: [
        { name: 'iPhone 15 Pro', revenue: 234567, units: 234 },
        { name: 'Samsung Galaxy S24', revenue: 189234, units: 189 },
        { name: 'MacBook Pro', revenue: 456789, units: 123 }
      ]
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSnackbar(`${reportTypes.find(r => r.id === selectedReport)?.name} generated successfully!`, 'success');
    }, 2000);
  };

  const handleScheduleReport = () => {
    setShowScheduleDialog(true);
  };

  const renderReportCard = (report) => (
    <Card 
      key={report.id}
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        },
        border: selectedReport === report.id ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent'
      }}
      onClick={() => setSelectedReport(report.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(report.icon, { 
                sx: { color: 'primary.main', fontSize: 28 } 
              })}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {report.name}
              </Typography>
              <Chip label={report.category} size="small" color="primary" variant="outlined" />
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {report.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Last generated: {report.lastGenerated}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Size: {report.size}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {report.formats.map((format, index) => (
              <Chip key={index} label={format} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderReportConfiguration = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Report Configuration
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange.preset}
              onChange={(e) => setDateRange({...dateRange, preset: e.target.value})}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="last7">Last 7 Days</MenuItem>
              <MenuItem value="last30">Last 30 Days</MenuItem>
              <MenuItem value="last90">Last 90 Days</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="thisQuarter">This Quarter</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
            >
              <MenuItem value="pdf">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdf />
                  PDF Document
                </Box>
              </MenuItem>
              <MenuItem value="excel">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableChart />
                  Excel Spreadsheet
                </Box>
              </MenuItem>
              <MenuItem value="csv">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment />
                  CSV Data
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {dateRange.preset === 'custom' && (
          <LocalizationProvider>
            <Grid item xs={6}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(date) => setDateRange({...dateRange, start: date})}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(date) => setDateRange({...dateRange, end: date})}
              />
            </Grid>
          </LocalizationProvider>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Include in Report
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                />
              }
              label="Charts & Graphs"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Summary Tables"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Detailed Breakdown"
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Comparative Analysis"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Executive Summary"
            />
          </FormGroup>
        </Grid>
      </Grid>
    </Card>
  );

  const renderReportPreview = () => {
    const reportData = sampleData[selectedReport] || sampleData.inventory;
    
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Report Preview
          </Typography>
          {loading && <CircularProgress size={24} />}
        </Box>

        {selectedReport === 'inventory' && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {reportData.totalItems.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Total Items</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    ${(reportData.totalValue / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2">Total Value</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {reportData.lowStockItems}
                  </Typography>
                  <Typography variant="body2">Low Stock</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {reportData.outOfStock}
                  </Typography>
                  <Typography variant="body2">Out of Stock</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={{
                      labels: reportData.topCategories.map(cat => cat.name),
                      datasets: [{
                        label: 'Value ($)',
                        data: reportData.topCategories.map(cat => cat.value * 10000),
                      }]
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 300 }}>
                  <Doughnut
                    data={{
                      labels: reportData.topCategories.map(cat => cat.name),
                      datasets: [{
                        data: reportData.topCategories.map(cat => cat.items),
                      }]
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Items</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.topCategories.map((category, index) => (
                    <TableRow key={index} hover>
                      <TableCell fontWeight={600}>{category.name}</TableCell>
                      <TableCell align="right">{category.items}</TableCell>
                      <TableCell align="right">${(category.value * 10000).toLocaleString()}</TableCell>
                      <TableCell align="right">{category.value}%</TableCell>
                      <TableCell>
                        <Chip 
                          label="Healthy" 
                          color="success" 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {selectedReport === 'sales' && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    ${(sampleData.sales.totalRevenue / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2">Total Revenue</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {sampleData.sales.totalOrders.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Total Orders</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    ${sampleData.sales.averageOrderValue}
                  </Typography>
                  <Typography variant="body2">Avg Order Value</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                  <Typography variant="h4" fontWeight={700}>
                    +{sampleData.sales.growthRate}%
                  </Typography>
                  <Typography variant="body2">Growth Rate</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ height: 300, mb: 4 }}>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    label: 'Monthly Revenue',
                    data: [245000, 267000, 289000, 312000, 298000, 334000],
                  }]
                }}
              />
            </Box>
          </Box>
        )}

        {!['inventory', 'sales'].includes(selectedReport) && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Assessment sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {reportTypes.find(r => r.id === selectedReport)?.name} Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure settings and generate report to view detailed data
            </Typography>
          </Box>
        )}
      </Card>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Assessment sx={{ color: 'primary.main', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Advanced Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive business intelligence and analytics
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                icon={<CloudQueue />}
                label="Cloud Sync Enabled"
                color="success"
                variant="outlined"
                size="small"
              />
              
              <Tooltip title="Toggle Theme">
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Download />}
                onClick={handleGenerateReport}
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={20} /> : 'Generate Report'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Schedule />}
                onClick={handleScheduleReport}
                size="large"
              >
                Schedule Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Share />}
                size="large"
              >
                Share Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CloudDownload />}
                size="large"
              >
                Import Template
              </Button>
            </Grid>
          </Grid>

          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab icon={<Assessment />} label="Generate" />
            <Tab icon={<Schedule />} label="Scheduled" />
            <Tab icon={<FolderOpen />} label="Library" />
            <Tab icon={<Analytics />} label="Analytics" />
          </Tabs>

          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Select Report Type
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reportTypes.map((report) => renderReportCard(report))}
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {renderReportConfiguration()}
                  {renderReportPreview()}
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === 1 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Scheduled Reports
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scheduledReports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {report.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Next: {report.nextRun}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={report.type} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>{report.schedule}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {report.recipients.length} recipients
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={report.status}
                            color={report.status === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {currentTab === 2 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <FolderOpen sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>Report Library</Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Access your saved reports and templates
              </Typography>
              <Button variant="contained" size="large" startIcon={<CreateNewFolder />}>
                Browse Library
              </Button>
            </Box>
          )}

          {currentTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Report Generation Trends
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                          label: 'Reports Generated',
                          data: [12, 19, 15, 25, 22, 18, 24],
                        }]
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Popular Report Types
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut
                      data={{
                        labels: ['Inventory', 'Sales', 'Financial', 'Analytics'],
                        datasets: [{
                          data: [35, 28, 22, 15],
                        }]
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        <Dialog open={showScheduleDialog} onClose={() => setShowScheduleDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Schedule New Report</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Name"
                  placeholder="Enter report name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select defaultValue="inventory">
                    {reportTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select defaultValue="daily">
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Recipients"
                  placeholder="Enter email addresses separated by commas"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => {
              setShowScheduleDialog(false);
              showSnackbar('Report scheduled successfully!', 'success');
            }}>
              Schedule Report
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdvancedReports;