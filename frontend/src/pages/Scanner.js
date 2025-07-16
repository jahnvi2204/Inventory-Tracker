import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Fab,
  Snackbar,
} from '@mui/material';
import {
  QrCodeScanner,
  Close as CloseIcon,
  CameraAlt,
  Search,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit,
  Save,
  Cancel,
  Inventory,
  LocalShipping,
  AttachMoney,
  Timeline,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Info,
  Lightbulb,
  AutoGraph,
  Business,
  Phone,
  Email,
  LocationOn,
  Category,
  Schedule,
  Person,
  AdminPanelSettings,
  SupervisorAccount,
  ExpandMore,
  Refresh,
  Visibility,
  Delete,
  Share,
  Star,
  History,
  Backup,
  Security,
  Help,
  MoreVert,
  PhotoCamera,
  Upload,
  Download,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  Tune,
  Speed,
  FlashOn,
  FlashOff,
  CenterFocusStrong,
  Fullscreen,
  FullscreenExit,
  Vibration,
  VolumeUp,
  VolumeOff,
  Wifi,
  SignalWifi4Bar,
  Battery90,
  Bluetooth,
  Print,
  LightMode,
  DarkMode,
  Analytics,
  Settings,
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

const Scanner = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [scanMode, setScanMode] = useState('single');
  const [scanSettings, setScanSettings] = useState({
    autoFocus: true,
    flashlight: false,
    sound: true,
    vibration: true,
    quality: 'high',
    orientation: 'auto',
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [batchScans, setBatchScans] = useState([]);
  const [scanHistory, setScanHistory] = useState([
    { 
      id: 1, 
      barcode: '123456789012', 
      product: 'iPhone 15 Pro', 
      action: 'Updated quantity +5', 
      time: '2 min ago',
      user: 'John Doe',
      location: 'A1-B2-C3',
      status: 'success'
    },
    { 
      id: 2, 
      barcode: '987654321098', 
      product: 'Samsung Galaxy S24', 
      action: 'Added to inventory', 
      time: '15 min ago',
      user: 'Jane Smith',
      location: 'A1-B2-C4',
      status: 'success'
    },
    { 
      id: 3, 
      barcode: '456789123456', 
      product: 'Organic Milk', 
      action: 'Price updated', 
      time: '1 hour ago',
      user: 'Mike Johnson',
      location: 'B2-C1-D1',
      status: 'warning'
    },
    { 
      id: 4, 
      barcode: '789123456789', 
      product: 'Unknown Product', 
      action: 'Product not found', 
      time: '2 hours ago',
      user: 'Sarah Wilson',
      location: 'Manual Entry',
      status: 'error'
    },
  ]);

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Electronics',
      sku: '123456789012',
      barcode: '123456789012',
      quantity: 45,
      minQuantity: 10,
      price: 999,
      cost: 750,
      supplier: 'Apple Inc.',
      status: 'active',
      alerts: { lowStock: false, nearExpiry: false },
      expiryDate: null,
      lastUpdated: new Date(),
      location: 'A1-B2-C3',
      description: 'Latest iPhone with Pro camera system',
      weight: '221g',
      dimensions: '159.9 × 76.7 × 8.25 mm',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      category: 'Electronics',
      sku: '987654321098',
      barcode: '987654321098',
      quantity: 8,
      minQuantity: 15,
      price: 899,
      cost: 650,
      supplier: 'Samsung',
      status: 'active',
      alerts: { lowStock: true, nearExpiry: false },
      expiryDate: null,
      lastUpdated: new Date(),
      location: 'A1-B2-C4',
      description: 'Premium Android smartphone',
      weight: '196g',
      dimensions: '158.5 × 75.9 × 7.7 mm',
    }
  ];

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#ec4899',
        light: '#f472b6',
        dark: '#db2777',
      },
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
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: darkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          }
        }
      }
    }
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStartScan = () => {
    setScannerActive(true);
    showSnackbar('Scanner activated', 'info');
    
    setTimeout(() => {
      const product = products[Math.floor(Math.random() * products.length)];
      setScannedProduct(product);
      setScannerActive(false);
      
      const newScan = {
        id: scanHistory.length + 1,
        barcode: product.barcode,
        product: product.name,
        action: 'Product scanned',
        time: 'Just now',
        user: 'Current User',
        location: product.location,
        status: 'success'
      };
      setScanHistory([newScan, ...scanHistory]);
      
      showSnackbar(`Successfully scanned ${product.name}`, 'success');
    }, 3000);
  };

  const handleStopScan = () => {
    setScannerActive(false);
    showSnackbar('Scanner stopped', 'info');
  };

  const handleManualSearch = () => {
    if (manualBarcode) {
      const product = products.find(p => 
        p.barcode === manualBarcode || 
        p.sku === manualBarcode || 
        p.name.toLowerCase().includes(manualBarcode.toLowerCase())
      );
      
      if (product) {
        setScannedProduct(product);
        showSnackbar(`Product found: ${product.name}`, 'success');
        
        const newScan = {
          id: scanHistory.length + 1,
          barcode: manualBarcode,
          product: product.name,
          action: 'Manual search',
          time: 'Just now',
          user: 'Current User',
          location: 'Manual Entry',
          status: 'success'
        };
        setScanHistory([newScan, ...scanHistory]);
      } else {
        showSnackbar('Product not found in inventory', 'warning');
        setShowProductDialog(true);
      }
      setManualBarcode('');
    }
  };

  const handleQuantityUpdate = (change) => {
    if (scannedProduct) {
      const newQuantity = scannedProduct.quantity + change;
      if (newQuantity >= 0) {
        setScannedProduct({...scannedProduct, quantity: newQuantity});
        showSnackbar(`Quantity updated to ${newQuantity}`, 'success');
        
        const newScan = {
          id: scanHistory.length + 1,
          barcode: scannedProduct.barcode,
          product: scannedProduct.name,
          action: `${change > 0 ? 'Added' : 'Removed'} ${Math.abs(change)} units`,
          time: 'Just now',
          user: 'Current User',
          location: scannedProduct.location,
          status: 'success'
        };
        setScanHistory([newScan, ...scanHistory]);
      }
    }
  };

  const renderScannerInterface = () => (
    <Card sx={{ p: 3, height: 'fit-content' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Camera Scanner
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Scanner Settings">
            <IconButton size="small">
              <Tune />
            </IconButton>
          </Tooltip>
          <Tooltip title={scanSettings.flashlight ? "Turn off flashlight" : "Turn on flashlight"}>
            <IconButton 
              size="small" 
              onClick={() => setScanSettings({...scanSettings, flashlight: !scanSettings.flashlight})}
              color={scanSettings.flashlight ? 'warning' : 'default'}
            >
              {scanSettings.flashlight ? <FlashOn /> : <FlashOff />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Focus Mode">
            <IconButton size="small">
              <CenterFocusStrong />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%', 
          height: 350, 
          bgcolor: 'background.default',
          border: `2px solid ${scannerActive ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          overflow: 'hidden',
          background: scannerActive 
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(45deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)'
        }}
      >
        {scannerActive ? (
          <Box sx={{ textAlign: 'center', position: 'relative', width: '100%', height: '100%' }}>
            {/* Corner Brackets */}
            {[
              { top: '20%', left: '20%', borderTop: '3px solid #6366f1', borderLeft: '3px solid #6366f1' },
              { top: '20%', right: '20%', borderTop: '3px solid #6366f1', borderRight: '3px solid #6366f1' },
              { bottom: '20%', left: '20%', borderBottom: '3px solid #6366f1', borderLeft: '3px solid #6366f1' },
              { bottom: '20%', right: '20%', borderBottom: '3px solid #6366f1', borderRight: '3px solid #6366f1' },
            ].map((style, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  ...style
                }}
              />
            ))}
            
            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body2" color="primary" sx={{ display: 'inline' }}>
                Scanning for barcodes...
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <QrCodeScanner sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" gutterBottom color="text.secondary">
              Ready to Scan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Position barcode within the frame
            </Typography>
            <Chip 
              icon={scanSettings.autoFocus ? <CheckCircle /> : <Error />}
              label={scanSettings.autoFocus ? "Auto-focus enabled" : "Manual focus"}
              size="small"
              color={scanSettings.autoFocus ? "success" : "warning"}
            />
          </Box>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            startIcon={scannerActive ? <CloseIcon /> : <CameraAlt />}
            onClick={scannerActive ? handleStopScan : handleStartScan}
            color={scannerActive ? 'error' : 'primary'}
            fullWidth
            size="large"
          >
            {scannerActive ? 'Stop Scanner' : 'Start Scanner'}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            startIcon={<PhotoCamera />}
            fullWidth
            size="large"
            disabled={scannerActive}
          >
            Capture Image
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Scan Mode
        </Typography>
        <Tabs 
          value={scanMode} 
          onChange={(e, value) => setScanMode(value)}
          variant="fullWidth"
          sx={{ bgcolor: 'background.default', borderRadius: 1 }}
        >
          <Tab label="Single" value="single" />
          <Tab label="Continuous" value="continuous" />
          <Tab label="Batch" value="batch" />
        </Tabs>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">OR</Typography>
      </Divider>

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Manual Entry
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Enter barcode, SKU, or product name"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="outlined" 
          onClick={handleManualSearch}
          startIcon={<Search />}
          disabled={!manualBarcode}
        >
          Search
        </Button>
      </Box>
    </Card>
  );

  const renderProductDetails = () => (
    <Card sx={{ p: 3, height: 'fit-content' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Product Details
      </Typography>
      
      {scannedProduct ? (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {scannedProduct.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  SKU: {scannedProduct.sku} • {scannedProduct.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scannedProduct.description}
                </Typography>
              </Box>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h4" fontWeight={700}>
                  {scannedProduct.quantity}
                </Typography>
                <Typography variant="body2">Current Stock</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h4" fontWeight={700}>
                  ${scannedProduct.price}
                </Typography>
                <Typography variant="body2">Selling Price</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              label={`Stock: ${scannedProduct.quantity}`}
              color={scannedProduct.alerts.lowStock ? 'warning' : 'success'}
              icon={scannedProduct.alerts.lowStock ? <Warning /> : <CheckCircle />}
            />
            <Chip 
              label={scannedProduct.status} 
              color="primary" 
              icon={<Inventory />}
            />
            <Chip 
              label={scannedProduct.supplier} 
              variant="outlined" 
              icon={<Business />}
            />
            <Chip 
              label={scannedProduct.location} 
              variant="outlined" 
              icon={<LocationOn />}
            />
          </Box>

          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>
                Additional Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Cost Price</Typography>
                  <Typography variant="body1" fontWeight={600}>${scannedProduct.cost}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Min Quantity</Typography>
                  <Typography variant="body1" fontWeight={600}>{scannedProduct.minQuantity}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Weight</Typography>
                  <Typography variant="body1" fontWeight={600}>{scannedProduct.weight}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Dimensions</Typography>
                  <Typography variant="body1" fontWeight={600}>{scannedProduct.dimensions}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Typography variant="subtitle2" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleQuantityUpdate(1)}
                color="success"
              >
                Add Stock
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<RemoveIcon />}
                onClick={() => handleQuantityUpdate(-1)}
                color="warning"
              >
                Remove Stock
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<Edit />}
                size="large"
              >
                Edit Product Details
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Tooltip title="View History">
              <IconButton>
                <History />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Product">
              <IconButton>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add to Favorites">
              <IconButton>
                <Star />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Label">
              <IconButton>
                <Print />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <QrCodeScanner sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Product Scanned
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Scan a barcode or search manually to view product details
          </Typography>
        </Box>
      )}
    </Card>
  );

  const renderScanHistory = () => (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Scan History
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter">
            <IconButton size="small">
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton size="small">
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear History">
            <IconButton size="small">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scanHistory.map((scan) => (
              <TableRow key={scan.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {scan.product}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                      {scan.barcode}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {scan.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {scan.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {scan.user.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="body2">
                      {scan.user}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {scan.time}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={scan.status}
                    color={scan.status === 'success' ? 'success' : scan.status === 'warning' ? 'warning' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const renderScannerSettings = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Scanner Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch 
                checked={scanSettings.autoFocus}
                onChange={(e) => setScanSettings({...scanSettings, autoFocus: e.target.checked})}
              />
            }
            label="Auto Focus"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch 
                checked={scanSettings.sound}
                onChange={(e) => setScanSettings({...scanSettings, sound: e.target.checked})}
              />
            }
            label="Sound Effects"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch 
                checked={scanSettings.vibration}
                onChange={(e) => setScanSettings({...scanSettings, vibration: e.target.checked})}
              />
            }
            label="Vibration"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Quality</InputLabel>
            <Select
              value={scanSettings.quality}
              onChange={(e) => setScanSettings({...scanSettings, quality: e.target.value})}
            >
              <MenuItem value="low">Low (Faster)</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High (Better accuracy)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <QrCodeScanner sx={{ color: 'primary.main', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Advanced Scanner
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional barcode scanning system
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                icon={scannerActive ? <CheckCircle /> : <Schedule />}
                label={scannerActive ? 'Scanning Active' : 'Ready'}
                color={scannerActive ? 'success' : 'default'}
                variant="outlined"
              />
              
              <Tooltip title="Connection Status">
                <Badge color="success" variant="dot">
                  <Wifi sx={{ color: 'success.main' }} />
                </Badge>
              </Tooltip>

              <Tooltip title="Toggle Theme">
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                title: 'Scans Today', 
                value: '247', 
                trend: '+12%', 
                icon: <QrCodeScanner />, 
                color: 'primary',
                trendUp: true
              },
              { 
                title: 'Success Rate', 
                value: '98.5%', 
                trend: '+0.3%', 
                icon: <CheckCircle />, 
                color: 'success',
                trendUp: true
              },
              { 
                title: 'Avg. Scan Time', 
                value: '1.2s', 
                trend: '-0.1s', 
                icon: <Speed />, 
                color: 'info',
                trendUp: true
              },
              { 
                title: 'Items Updated', 
                value: '186', 
                trend: '+8%', 
                icon: <Edit />, 
                color: 'warning',
                trendUp: true
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight={700}>
                        {stat.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {stat.trendUp ? (
                          <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                        ) : (
                          <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
                        )}
                        <Typography
                          variant="caption"
                          color={stat.trendUp ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {stat.trend}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}.light`,
                        borderRadius: 2,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(stat.icon, { 
                        sx: { color: `${stat.color}.main`, fontSize: 24 } 
                      })}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab icon={<CameraAlt />} label="Scanner" />
            <Tab icon={<History />} label="History" />
            <Tab icon={<Tune />} label="Settings" />
            <Tab icon={<Analytics />} label="Analytics" />
          </Tabs>

          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {renderScannerInterface()}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderProductDetails()}
              </Grid>
            </Grid>
          )}

          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {renderScanHistory()}
              </Grid>
            </Grid>
          )}

          {currentTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {renderScannerSettings()}
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Performance Settings
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Scan Speed vs Accuracy
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Balanced mode (recommended)
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-save scan results"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Batch processing mode"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Real-time inventory updates"
                  />
                </Card>
              </Grid>
            </Grid>
          )}

          {currentTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Scan Performance
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                          label: 'Daily Scans',
                          data: [45, 67, 89, 123, 156, 178, 234],
                        }]
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Error Analysis
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut
                      data={{
                        labels: ['Successful', 'Not Found', 'Invalid', 'Timeout'],
                        datasets: [{
                          data: [85, 8, 4, 3],
                        }]
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

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

export default Scanner;