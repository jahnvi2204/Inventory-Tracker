import React, { useState } from 'react';
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
  Stack,
  alpha,
  Breadcrumbs,
  Link,
  MenuItem as MenuItemComponent,
  ListItemAvatar,
  Collapse,
} from '@mui/material';
import {
  Assessment,
  Download,
  Upload,
  Share,
  Schedule,
  Email,
  CloudDownload,
  PictureAsPdf,
  TableChart,
  TrendingUp,
  Inventory,
  AttachMoney,
  LocalShipping,
  People,
  Menu,
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
  ExpandLess,
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
  PlayArrow,
  Pause,
  Stop,
  Archive,
  Unarchive,
  NotificationsActive,
  NotificationsOff,
  EventNote,
  History,
  Dashboard,
  WorkspacePremium,
  Security,
  Update,
  DataUsage,
  TrendingFlat,
  SignalCellularAlt,
  PieChartOutlined,
  BarChartOutlined,
  TimelineOutlined,
  InsertChartOutlined,
  Home,
  NavigateNext,
  Add,
  ShoppingCart,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/material';

// Enhanced Chart Components with better styling
const ChartWrapper = ({ children, title, subtitle }) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 3,
      height: '100%',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(236, 72, 153, 0.02) 100%)',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {children}
  </Paper>
);

const Line = ({ data, options, title, subtitle }) => (
  <ChartWrapper title={title} subtitle={subtitle}>
    <Box sx={{ 
      height: 300,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <TimelineOutlined sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            {data.datasets[0].label}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Interactive chart would render here
          </Typography>
        </Box>
      </Box>
    </Box>
  </ChartWrapper>
);

const Bar = ({ data, options, title, subtitle }) => (
  <ChartWrapper title={title} subtitle={subtitle}>
    <Box sx={{ 
      height: 300,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(45deg, #10b981 30%, #f59e0b 90%)',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <BarChartOutlined sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            {data.datasets[0].label}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Interactive chart would render here
          </Typography>
        </Box>
      </Box>
    </Box>
  </ChartWrapper>
);

const Doughnut = ({ data, options, title, subtitle }) => (
  <ChartWrapper title={title} subtitle={subtitle}>
    <Box sx={{ 
      height: 300,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(45deg, #8b5cf6 30%, #06b6d4 90%)',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <PieChartOutlined sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Category Distribution
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Interactive chart would render here
          </Typography>
        </Box>
      </Box>
    </Box>
  </ChartWrapper>
);

// Animation keyframes
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Reports = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedReport, setSelectedReport] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-12-31',
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReportMenu, setSelectedReportMenu] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

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
      formats: ['PDF', 'Excel', 'CSV'],
      color: '#6366f1',
      trend: '+12%',
      priority: 'high'
    },
    { 
      id: 'sales', 
      name: 'Sales Analytics', 
      icon: <TrendingUp />, 
      description: 'Sales performance, trends, and revenue analysis',
      category: 'Financial',
      lastGenerated: '1 day ago',
      size: '4.1 MB',
      formats: ['PDF', 'Excel', 'PowerPoint'],
      color: '#10b981',
      trend: '+8%',
      priority: 'high'
    },
    { 
      id: 'purchase', 
      name: 'Purchase Orders', 
      icon: <LocalShipping />, 
      description: 'Supplier analysis, purchase patterns, and cost optimization',
      category: 'Procurement',
      lastGenerated: '3 hours ago',
      size: '1.8 MB',
      formats: ['PDF', 'Excel', 'CSV'],
      color: '#f59e0b',
      trend: '+5%',
      priority: 'medium'
    },
    { 
      id: 'profit', 
      name: 'Profit & Loss', 
      icon: <AttachMoney />, 
      description: 'Comprehensive P&L analysis with margin breakdown',
      category: 'Financial',
      lastGenerated: '6 hours ago',
      size: '3.2 MB',
      formats: ['PDF', 'Excel'],
      color: '#ec4899',
      trend: '+15%',
      priority: 'high'
    },
    { 
      id: 'audit', 
      name: 'Audit Trail', 
      icon: <Security />, 
      description: 'Complete transaction history and compliance reporting',
      category: 'Compliance',
      lastGenerated: '12 hours ago',
      size: '5.7 MB',
      formats: ['PDF', 'CSV', 'JSON'],
      color: '#8b5cf6',
      trend: '+3%',
      priority: 'medium'
    },
    { 
      id: 'analytics', 
      name: 'AI Insights', 
      icon: <Psychology />, 
      description: 'Machine learning powered insights and predictions',
      category: 'Intelligence',
      lastGenerated: '30 min ago',
      size: '2.9 MB',
      formats: ['PDF', 'Interactive Dashboard'],
      color: '#06b6d4',
      trend: '+22%',
      priority: 'high'
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
      nextRun: 'Tomorrow at 9:00 AM',
      lastRun: 'Today at 9:00 AM',
      success: true
    },
    {
      id: 2,
      name: 'Weekly Sales Report',
      type: 'sales',
      schedule: 'Every Monday at 8:00 AM',
      recipients: ['sales@company.com', 'ceo@company.com'],
      format: 'Excel',
      status: 'active',
      nextRun: 'Monday at 8:00 AM',
      lastRun: 'Last Monday at 8:00 AM',
      success: true
    },
    {
      id: 3,
      name: 'Monthly P&L Report',
      type: 'profit',
      schedule: '1st of every month',
      recipients: ['finance@company.com'],
      format: 'PDF',
      status: 'paused',
      nextRun: 'Paused',
      lastRun: 'December 1st',
      success: false
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
        { name: 'Electronics', value: 45, items: 234, trend: '+12%' },
        { name: 'Clothing', value: 28, items: 189, trend: '+8%' },
        { name: 'Home & Garden', value: 15, items: 156, trend: '+5%' },
        { name: 'Sports', value: 12, items: 98, trend: '+3%' }
      ]
    },
    sales: {
      totalRevenue: 2847392,
      totalOrders: 3247,
      averageOrderValue: 877,
      growthRate: 18.5,
      topProducts: [
        { name: 'iPhone 15 Pro', revenue: 234567, units: 234, trend: '+18%' },
        { name: 'Samsung Galaxy S24', revenue: 189234, units: 189, trend: '+15%' },
        { name: 'MacBook Pro', revenue: 456789, units: 123, trend: '+22%' }
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

  const handleMenuClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportMenu(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportMenu(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const renderReportCard = (report) => (
    <Card 
      key={report.id}
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        background: selectedReport === report.id 
          ? `linear-gradient(135deg, ${alpha(report.color, 0.1)} 0%, ${alpha(report.color, 0.05)} 100%)`
          : 'background.paper',
        border: selectedReport === report.id ? `2px solid ${report.color}` : '1px solid',
        borderColor: selectedReport === report.id ? report.color : 'divider',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${alpha(report.color, 0.2)}`,
          borderColor: report.color
        },
        animation: `${slideUp} 0.6s ease-out`,
        borderRadius: 3
      }}
      onClick={() => setSelectedReport(report.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                background: `linear-gradient(45deg, ${report.color}, ${alpha(report.color, 0.7)})`,
                borderRadius: 3,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 24px ${alpha(report.color, 0.3)}`,
                animation: selectedReport === report.id ? `${pulse} 2s ease-in-out infinite` : 'none'
              }}
            >
              {React.cloneElement(report.icon, { 
                sx: { color: 'white', fontSize: 28 } 
              })}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {report.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip 
                  label={report.category} 
                  size="small" 
                  sx={{ 
                    backgroundColor: alpha(report.color, 0.1),
                    color: report.color,
                    fontWeight: 600
                  }}
                />
                <Chip 
                  label={report.priority} 
                  size="small" 
                  color={getPriorityColor(report.priority)}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, report);
            }}
            sx={{ 
              backgroundColor: alpha(report.color, 0.1),
              '&:hover': { backgroundColor: alpha(report.color, 0.2) }
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
          {report.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Last generated: {report.lastGenerated}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Size: {report.size}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              {report.trend}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {report.formats.map((format, index) => (
            <Chip 
              key={index} 
              label={format} 
              size="small" 
              variant="outlined"
              sx={{ 
                borderColor: alpha(report.color, 0.3),
                color: report.color,
                '&:hover': { backgroundColor: alpha(report.color, 0.1) }
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderReportConfiguration = () => (
    <Card sx={{ p: 3, animation: `${slideUp} 0.6s ease-out 0.2s both` }}>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings color="primary" />
        Report Configuration
      </Typography>
      
      <Accordion 
        expanded={expandedAccordion} 
        onChange={() => setExpandedAccordion(!expandedAccordion)}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Advanced Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    color="primary"
                  />
                }
                label="Include Charts & Graphs"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label="Include Summary Tables"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange.preset}
              onChange={(e) => setDateRange({...dateRange, preset: e.target.value})}
              label="Date Range"
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
          <FormControl fullWidth variant="outlined">
            <InputLabel>Export Format</InputLabel>
            <Select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              label="Export Format"
            >
              <MenuItem value="pdf">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdf color="error" />
                  PDF Document
                </Box>
              </MenuItem>
              <MenuItem value="excel">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableChart color="success" />
                  Excel Spreadsheet
                </Box>
              </MenuItem>
              <MenuItem value="csv">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment color="primary" />
                  CSV Data
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {dateRange.preset === 'custom' && (
          <>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );

  const renderStatCard = ({ title, value, subtitle, color, icon, trend }) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: `linear-gradient(45deg, ${alpha('#fff', 0.2)}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(30px, -30px)'
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {value}
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: alpha('#fff', 0.2),
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 16 }} />
            <Typography variant="body2" fontWeight={600}>
              {trend} from last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderReportPreview = () => {
    const reportData = sampleData[selectedReport] || sampleData.inventory;
    
    return (
      <Card sx={{ p: 3, animation: `${slideUp} 0.6s ease-out 0.4s both` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility color="primary" />
            Report Preview
          </Typography>
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Generating...</Typography>
            </Box>
          )}
        </Box>

        {selectedReport === 'inventory' && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <Bar
                  data={{
                    labels: reportData.topCategories.map(cat => cat.name),
                    datasets: [{
                      label: 'Category Performance',
                      data: reportData.topCategories.map(cat => cat.value * 10000),
                    }]
                  }}
                  title="Top Categories by Value"
                  subtitle="Performance breakdown by category"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Doughnut
                  data={{
                    labels: reportData.topCategories.map(cat => cat.name),
                    datasets: [{
                      data: reportData.topCategories.map(cat => cat.items),
                    }]
                  }}
                  title="Category Distribution"
                  subtitle="Items by category"
                />
              </Grid>
            </Grid>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Items</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Value</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Trend</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.topCategories.map((category, index) => (
                      <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: alpha('#6366f1', 0.04) } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                              {category.name.charAt(0)}
                            </Avatar>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {category.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {category.items.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${(category.value * 10000).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              {category.trend}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Healthy" 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {selectedReport === 'sales' && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                {renderStatCard({
                  title: 'Total Revenue',
                  value: `${(sampleData.sales.totalRevenue / 1000000).toFixed(1)}M`,
                  color: '#10b981',
                  icon: <AttachMoney sx={{ fontSize: 28 }} />,
                  trend: '+18%'
                })}
              </Grid>
              <Grid item xs={6} md={3}>
                {renderStatCard({
                  title: 'Total Orders',
                  value: sampleData.sales.totalOrders.toLocaleString(),
                  color: '#6366f1',
                  icon: <ShoppingCart sx={{ fontSize: 28 }} />,
                  trend: '+12%'
                })}
              </Grid>
              <Grid item xs={6} md={3}>
                {renderStatCard({
                  title: 'Avg Order Value',
                  value: `${sampleData.sales.averageOrderValue}`,
                  color: '#06b6d4',
                  icon: <TrendingUp sx={{ fontSize: 28 }} />,
                  trend: '+8%'
                })}
              </Grid>
              <Grid item xs={6} md={3}>
                {renderStatCard({
                  title: 'Growth Rate',
                  value: `+${sampleData.sales.growthRate}%`,
                  color: '#8b5cf6',
                  icon: <Analytics sx={{ fontSize: 28 }} />,
                  trend: '+5%'
                })}
              </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    label: 'Monthly Revenue Trend',
                    data: [245000, 267000, 289000, 312000, 298000, 334000],
                  }]
                }}
                title="Revenue Trend Analysis"
                subtitle="Monthly performance over the last 6 months"
              />
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'success.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Product</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Revenue</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Units</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Trend</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleData.sales.topProducts.map((product, index) => (
                      <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: alpha('#10b981', 0.04) } }}>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${product.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {product.units.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              {product.trend}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Excellent" 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {!['inventory', 'sales'].includes(selectedReport) && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                backgroundColor: alpha('#6366f1', 0.1),
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                animation: `${float} 3s ease-in-out infinite`
              }}
            >
              <Assessment sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {reportTypes.find(r => r.id === selectedReport)?.name} Preview
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Configure your settings and generate the report to view detailed analytics and insights
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Settings />}
              sx={{ mt: 2 }}
            >
              Configure Report
            </Button>
          </Box>
        )}
      </Card>
    );
  };

  const renderScheduledReportCard = (report) => (
    <Card 
      key={report.id}
      sx={{ 
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {report.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <Chip 
                label={report.type} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip 
                label={report.status}
                size="small" 
                color={report.status === 'active' ? 'success' : 'warning'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" color="primary">
              <Edit />
            </IconButton>
            <IconButton size="small" color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Schedule
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {report.schedule}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Format
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {report.format}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Recipients
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {report.recipients.length} recipients
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Next Run
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {report.nextRun}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {report.success ? (
              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <Error sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography variant="caption" color="text.secondary">
              Last run: {report.lastRun}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={report.status === 'active' ? 'Pause' : 'Resume'}>
              <IconButton size="small">
                {report.status === 'active' ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Run Now">
              <IconButton size="small" color="primary">
                <PlayArrow />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Enhanced Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                p: 2,
                animation: `${pulse} 3s ease-in-out infinite`
              }}
            >
              <Assessment sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Advanced Reports
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Comprehensive business intelligence and analytics dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              icon={<CloudQueue />}
              label="Cloud Sync Active"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip 
              icon={<Security />}
              label="SOC 2 Compliant"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
            <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" href="/reports">
              Reports
            </Link>
            <Typography color="text.primary">Advanced Reports</Typography>
          </Breadcrumbs>
        </Box>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Download />}
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5 30%, #db2777 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Schedule />}
              onClick={handleScheduleReport}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Schedule Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Share />}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Share Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<CloudDownload />}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Import Template
            </Button>
          </Grid>
        </Grid>

        {/* Enhanced Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ 
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: 120
              }
            }}
          >
            <Tab 
              icon={<Assessment />} 
              label="Generate Reports" 
              iconPosition="start"
              sx={{ 
                backgroundColor: currentTab === 0 ? alpha('#6366f1', 0.1) : 'transparent',
                borderRadius: 2,
                mr: 1
              }}
            />
            <Tab 
              icon={<Schedule />} 
              label="Scheduled Reports" 
              iconPosition="start"
              sx={{ 
                backgroundColor: currentTab === 1 ? alpha('#6366f1', 0.1) : 'transparent',
                borderRadius: 2,
                mr: 1
              }}
            />
            <Tab 
              icon={<FolderOpen />} 
              label="Report Library" 
              iconPosition="start"
              sx={{ 
                backgroundColor: currentTab === 2 ? alpha('#6366f1', 0.1) : 'transparent',
                borderRadius: 2,
                mr: 1
              }}
            />
            <Tab 
              icon={<Analytics />} 
              label="Usage Analytics" 
              iconPosition="start"
              sx={{ 
                backgroundColor: currentTab === 3 ? alpha('#6366f1', 0.1) : 'transparent',
                borderRadius: 2
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
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
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                Scheduled Reports
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowScheduleDialog(true)}
                sx={{ fontWeight: 600 }}
              >
                Add Schedule
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {scheduledReports.map((report) => (
                <Grid item xs={12} md={6} lg={4} key={report.id}>
                  {renderScheduledReportCard(report)}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {currentTab === 2 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                backgroundColor: alpha('#6366f1', 0.1),
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                animation: `${float} 3s ease-in-out infinite`
              }}
            >
              <FolderOpen sx={{ fontSize: 60, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Report Library
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Access your saved reports, templates, and shared documents
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<CreateNewFolder />}
              sx={{ fontWeight: 600 }}
            >
              Browse Library
            </Button>
          </Box>
        )}

        {currentTab === 3 && (
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Usage Analytics
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                {renderStatCard({
                  title: 'Reports Generated',
                  value: '2,847',
                  subtitle: 'This month',
                  color: '#6366f1',
                  icon: <Assessment sx={{ fontSize: 28 }} />,
                  trend: '+23%'
                })}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderStatCard({
                  title: 'Active Schedules',
                  value: '12',
                  subtitle: 'Running',
                  color: '#10b981',
                  icon: <Schedule sx={{ fontSize: 28 }} />,
                  trend: '+8%'
                })}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderStatCard({
                  title: 'Data Processed',
                  value: '1.2TB',
                  subtitle: 'This quarter',
                  color: '#f59e0b',
                  icon: <DataUsage sx={{ fontSize: 28 }} />,
                  trend: '+15%'
                })}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderStatCard({
                  title: 'Users Active',
                  value: '89',
                  subtitle: 'This week',
                  color: '#ec4899',
                  icon: <People sx={{ fontSize: 28 }} />,
                  trend: '+12%'
                })}
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Line
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                      label: 'Reports Generated',
                      data: [12, 19, 15, 25, 22, 18, 24],
                    }]
                  }}
                  title="Report Generation Trends"
                  subtitle="Weekly report generation activity"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Doughnut
                  data={{
                    labels: ['Inventory', 'Sales', 'Financial', 'Analytics'],
                    datasets: [{
                      data: [35, 28, 22, 15],
                    }]
                  }}
                  title="Popular Report Types"
                  subtitle="Most requested report categories"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Top Users
                  </Typography>
                  <List>
                    {[
                      { name: 'John Doe', reports: 45, avatar: 'JD' },
                      { name: 'Jane Smith', reports: 38, avatar: 'JS' },
                      { name: 'Mike Johnson', reports: 32, avatar: 'MJ' },
                      { name: 'Sarah Wilson', reports: 28, avatar: 'SW' },
                    ].map((user, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          secondary={`${user.reports} reports generated`}
                        />
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">Average Generation Time</Typography>
                      <Typography variant="body2" fontWeight={600}>2.3s</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">Success Rate</Typography>
                      <Typography variant="body2" fontWeight={600}>98.5%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={98.5} 
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">User Satisfaction</Typography>
                      <Typography variant="body2" fontWeight={600}>4.7/5</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={94} 
                      color="info"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2">Resource Usage</Typography>
                      <Typography variant="body2" fontWeight={600}>67%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={67} 
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Enhanced Schedule Dialog */}
      <Dialog 
        open={showScheduleDialog} 
        onClose={() => setShowScheduleDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Schedule color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Schedule New Report
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Name"
                placeholder="Enter descriptive report name"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assessment />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select defaultValue="inventory">
                  {reportTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select defaultValue="daily">
                  <MenuItem value="daily">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday />
                      Daily
                    </Box>
                  </MenuItem>
                  <MenuItem value="weekly">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DateRange />
                      Weekly
                    </Box>
                  </MenuItem>
                  <MenuItem value="monthly">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventNote />
                      Monthly
                    </Box>
                  </MenuItem>
                  <MenuItem value="quarterly">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <History />
                      Quarterly
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                defaultValue="09:00"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select defaultValue="pdf">
                  <MenuItem value="pdf">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PictureAsPdf />
                      PDF
                    </Box>
                  </MenuItem>
                  <MenuItem value="excel">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableChart />
                      Excel
                    </Box>
                  </MenuItem>
                  <MenuItem value="csv">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assessment />
                      CSV
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Recipients"
                placeholder="Enter email addresses separated by commas"
                multiline
                rows={3}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Additional Options
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Include charts"
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Send notifications"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Compress files"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowScheduleDialog(false)} 
            size="large"
            startIcon={<Error />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<CheckCircle />}
            onClick={() => {
              setShowScheduleDialog(false);
              showSnackbar('Report scheduled successfully!', 'success');
            }}
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #4f46e5 30%, #db2777 90%)',
              }
            }}
          >
            Schedule Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { 
            borderRadius: 2, 
            minWidth: 200,
            boxShadow: theme.shadows[8]
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItemComponent 
          onClick={handleMenuClose}
          sx={{ '&:hover': { backgroundColor: alpha('#6366f1', 0.1) } }}
        >
          <ListItemIcon>
            <Edit fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Edit Report</ListItemText>
        </MenuItemComponent>
        
        <MenuItemComponent 
          onClick={handleMenuClose}
          sx={{ '&:hover': { backgroundColor: alpha('#10b981', 0.1) } }}
        >
          <ListItemIcon>
            <FileCopy fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItemComponent>
        
        <MenuItemComponent 
          onClick={handleMenuClose}
          sx={{ '&:hover': { backgroundColor: alpha('#f59e0b', 0.1) } }}
        >
          <ListItemIcon>
            <Share fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItemComponent>
        
        <MenuItemComponent 
          onClick={handleMenuClose}
          sx={{ '&:hover': { backgroundColor: alpha('#06b6d4', 0.1) } }}
        >
          <ListItemIcon>
            <Download fontSize="small" color="info" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItemComponent>
        
        <Divider />
        
        <MenuItemComponent 
          onClick={handleMenuClose}
          sx={{ '&:hover': { backgroundColor: alpha('#ef4444', 0.1) } }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItemComponent>
      </Menu>

      {/* Enhanced Snackbar */}
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
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
            '& .MuiAlert-icon': {
              fontSize: 20
            }
          }}
          icon={
            snackbar.severity === 'success' ? <CheckCircle /> :
            snackbar.severity === 'error' ? <Error /> :
            snackbar.severity === 'warning' ? <Warning /> : 
            <Info />
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4f46e5 30%, #db2777 90%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          boxShadow: theme.shadows[12],
        }}
        onClick={() => setShowScheduleDialog(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Reports; 