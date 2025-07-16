import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
  Badge,
  Tooltip,
  AppBar,
  Toolbar,
  Slider,
  LinearProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications,
  Security,
  Palette,
  Language,
  Storage,
  Backup,
  Update,
  Info,
  Help,
  Feedback,
  BugReport,
  Download,
  Upload,
  Delete,
  Edit,
  Save,
  Cancel,
  Check,
  Warning,
  Error,
  CloudSync,
  Wifi,
  Bluetooth,
  VolumeUp,
  Brightness6,
  PowerSettingsNew,
  AccountCircle,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  BusinessOutlined,
  LockOutlined,
  VisibilityOutlined,
  NotificationsOutlined,
  ColorLensOutlined,
  LanguageOutlined,
  StorageOutlined,
  BackupOutlined,
  UpdateOutlined,
  InfoOutlined,
  HelpOutlineOutlined,
  FeedbackOutlined,
  BugReportOutlined,
  LightMode,
  DarkMode,
  Home,
  Dashboard,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useThemeMode } from '../context/ThemeContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [currentTab, setCurrentTab] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    desktop: true,
    marketing: false,
    security: true,
    updates: true,
    reports: true
  });

  const [preferences, setPreferences] = useState({
    theme: darkMode ? 'dark' : 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    autoSave: true,
    compactView: false,
    soundEffects: true,
    animations: true
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordExpiry: 90,
    ipWhitelist: false,
    apiAccess: false
  });

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    position: 'CEO',
    location: 'New York, USA',
    bio: 'Chief Executive Officer with 15+ years of experience in technology and business development.'
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleNotificationsChange = (type) => (event) => {
    setNotifications({ ...notifications, [type]: event.target.checked });
    showSnackbar(`${type} notifications ${event.target.checked ? 'enabled' : 'disabled'}`, 'success');
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences({...preferences, [key]: value});
    showSnackbar('Preference updated', 'success');
  };

  const handleSecurityChange = (key, value) => {
    setSecurity({...security, [key]: value});
    showSnackbar('Security setting updated', 'success');
  };

  const handleProfileSave = () => {
    showSnackbar('Profile updated successfully', 'success');
  };

  const handleExportData = () => {
    setDialogType('export');
    setShowDialog(true);
  };

  const handleResetSettings = () => {
    setDialogType('reset');
    setShowDialog(true);
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              margin: '0 auto 16px',
              bgcolor: 'primary.main',
              fontSize: '3rem'
            }}
          >
            {profile.firstName[0]}{profile.lastName[0]}
          </Avatar>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {profile.firstName} {profile.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {profile.position} at {profile.company}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {profile.location}
          </Typography>
          <Button variant="outlined" startIcon={<Edit />}>
            Change Photo
          </Button>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Account Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Email Verified</Typography>
              <Chip label="Verified" color="success" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">2FA Status</Typography>
              <Chip 
                label={security.twoFactorEnabled ? "Enabled" : "Disabled"} 
                color={security.twoFactorEnabled ? "success" : "warning"} 
                size="small" 
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Last Login</Typography>
              <Typography variant="body2" color="text.secondary">2 hours ago</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Member Since</Typography>
              <Typography variant="body2" color="text.secondary">Jan 2023</Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                InputProps={{
                  startAdornment: <EmailOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                InputProps={{
                  startAdornment: <PhoneOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={profile.company}
                onChange={(e) => setProfile({...profile, company: e.target.value})}
                InputProps={{
                  startAdornment: <BusinessOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={profile.position}
                onChange={(e) => setProfile({...profile, position: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={profile.location}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                InputProps={{
                  startAdornment: <LocationOnOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell us about yourself..."
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<Save />} onClick={handleProfileSave}>
              Save Changes
            </Button>
            <Button variant="outlined" startIcon={<Cancel />}>
              Cancel
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPreferencesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <ColorLensOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Appearance
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            }
            label="Dark Mode"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={preferences.animations}
                onChange={(e) => handlePreferenceChange('animations', e.target.checked)}
              />
            }
            label="Enable Animations"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={preferences.compactView}
                onChange={(e) => handlePreferenceChange('compactView', e.target.checked)}
              />
            }
            label="Compact View"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={preferences.soundEffects}
                onChange={(e) => handlePreferenceChange('soundEffects', e.target.checked)}
              />
            }
            label="Sound Effects"
          />
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <LanguageOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Localization
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="EST">Eastern Time</MenuItem>
                  <MenuItem value="PST">Pacific Time</MenuItem>
                  <MenuItem value="GMT">Greenwich Mean Time</MenuItem>
                  <MenuItem value="JST">Japan Standard Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                  <MenuItem value="JPY">JPY (¥)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <NotificationsOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Notifications
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><EmailOutlined /></ListItemIcon>
              <ListItemText primary="Email Notifications" secondary="Receive updates via email" />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.email}
                  onChange={handleNotificationsChange('email')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><PhoneOutlined /></ListItemIcon>
              <ListItemText primary="SMS Notifications" secondary="Receive text messages" />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.sms}
                  onChange={handleNotificationsChange('sms')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><Notifications /></ListItemIcon>
              <ListItemText primary="Push Notifications" secondary="Browser notifications" />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.push}
                  onChange={handleNotificationsChange('push')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><Security /></ListItemIcon>
              <ListItemText primary="Security Alerts" secondary="Important security notifications" />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.security}
                  onChange={handleNotificationsChange('security')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><Update /></ListItemIcon>
              <ListItemText primary="System Updates" secondary="Software update notifications" />
              <ListItemSecondaryAction>
                <Switch
                  checked={notifications.updates}
                  onChange={handleNotificationsChange('updates')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            General Preferences
          </Typography>
          
          <FormControlLabel
            control={
              <Switch 
                checked={preferences.autoSave}
                onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
              />
            }
            label="Auto-save changes"
          />
        </Card>
      </Grid>
    </Grid>
  );

  const renderSecurityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <LockOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Authentication
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle2">Two-Factor Authentication</Typography>
                <Typography variant="body2" color="text.secondary">
                  Add an extra layer of security to your account
                </Typography>
              </Box>
              <Switch
                checked={security.twoFactorEnabled}
                onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
              />
            </Box>
            
            {security.twoFactorEnabled && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Two-factor authentication is enabled. Your account is more secure.
              </Alert>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Session Timeout
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Automatically log out after {security.sessionTimeout} minutes of inactivity
            </Typography>
            <Slider
              value={security.sessionTimeout}
              onChange={(e, value) => handleSecurityChange('sessionTimeout', value)}
              min={5}
              max={120}
              step={5}
              marks={[
                { value: 5, label: '5m' },
                { value: 30, label: '30m' },
                { value: 60, label: '1h' },
                { value: 120, label: '2h' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <FormControlLabel
            control={
              <Switch 
                checked={security.loginNotifications}
                onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
              />
            }
            label="Login notifications"
          />
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Password Settings
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Password expires every {security.passwordExpiry} days
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              Password strength: Strong
            </Typography>
          </Box>

          <Button variant="outlined" fullWidth sx={{ mb: 2 }}>
            Change Password
          </Button>
          
          <Button variant="outlined" fullWidth>
            Download Recovery Codes
          </Button>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Access Control
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon><Wifi /></ListItemIcon>
              <ListItemText 
                primary="IP Whitelist" 
                secondary="Restrict access to specific IP addresses" 
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={security.ipWhitelist}
                  onChange={(e) => handleSecurityChange('ipWhitelist', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><Storage /></ListItemIcon>
              <ListItemText 
                primary="API Access" 
                secondary="Allow API access to your account" 
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={security.apiAccess}
                  onChange={(e) => handleSecurityChange('apiAccess', e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recent Activity
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Badge color="success" variant="dot">
                  <AccountCircle />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Login from Chrome" 
                secondary="New York, USA • 2 hours ago" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Badge color="warning" variant="dot">
                  <Security />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="Password changed" 
                secondary="2 days ago" 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Badge color="info" variant="dot">
                  <Notifications />
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary="2FA enabled" 
                secondary="1 week ago" 
              />
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSystemTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <StorageOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Data & Storage
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Storage Used</Typography>
              <Typography variant="body2" fontWeight={600}>47.2 GB / 100 GB</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={47.2} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Button 
            variant="outlined" 
            startIcon={<Download />} 
            fullWidth 
            sx={{ mb: 2 }}
            onClick={handleExportData}
          >
            Export Data
          </Button>
          
          <Button variant="outlined" startIcon={<Upload />} fullWidth sx={{ mb: 2 }}>
            Import Data
          </Button>
          
          <Button variant="outlined" startIcon={<Delete />} fullWidth color="error">
            Clear Cache
          </Button>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <BackupOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            Backup & Sync
          </Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Automatic backups"
          />
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Cloud sync"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last backup: 2 hours ago
            </Typography>
            <Button variant="outlined" startIcon={<Backup />}>
              Backup Now
            </Button>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            <InfoOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
            System Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Version</Typography>
              <Typography variant="body1" fontWeight={600}>v2.1.4</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Last Updated</Typography>
              <Typography variant="body1" fontWeight={600}>Jan 15, 2025</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Database</Typography>
              <Chip label="Connected" color="success" size="small" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Chip label="Healthy" color="success" size="small" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Build</Typography>
              <Typography variant="body1" fontFamily="monospace">
                2025.01.15.001
              </Typography>
            </Grid>
          </Grid>

          <Button variant="outlined" startIcon={<Update />} fullWidth sx={{ mt: 2 }}>
            Check for Updates
          </Button>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Support & Feedback
          </Typography>
          
          <List>
            <ListItem button>
              <ListItemIcon><HelpOutlineOutlined /></ListItemIcon>
              <ListItemText primary="Help Center" />
            </ListItem>
            
            <ListItem button>
              <ListItemIcon><FeedbackOutlined /></ListItemIcon>
              <ListItemText primary="Send Feedback" />
            </ListItem>
            
            <ListItem button>
              <ListItemIcon><BugReportOutlined /></ListItemIcon>
              <ListItemText primary="Report Bug" />
            </ListItem>
          </List>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom color="error">
            Danger Zone
          </Typography>
          
          <Button 
            variant="outlined" 
            color="error" 
            fullWidth 
            sx={{ mb: 2 }}
            onClick={handleResetSettings}
          >
            Reset All Settings
          </Button>
          
          <Button variant="outlined" color="error" fullWidth>
            Delete Account
          </Button>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <ThemeProvider theme={createTheme({
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
    })}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${createTheme({
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
        }).palette.divider}` }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <SettingsIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your preferences and system settings
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Toggle Theme">
                <IconButton onClick={toggleDarkMode}>
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab icon={<AccountCircle />} label="Profile" />
            <Tab icon={<Palette />} label="Preferences" />
            <Tab icon={<Security />} label="Security" />
            <Tab icon={<Storage />} label="System" />
          </Tabs>

          {currentTab === 0 && renderProfileTab()}
          {currentTab === 1 && renderPreferencesTab()}
          {currentTab === 2 && renderSecurityTab()}
          {currentTab === 3 && renderSystemTab()}
        </Box>

        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogType === 'export' && 'Export Data'}
            {dialogType === 'reset' && 'Reset Settings'}
          </DialogTitle>
          <DialogContent>
            {dialogType === 'export' && (
              <Box>
                <Typography variant="body1" paragraph>
                  Export your data including profile information, preferences, and activity logs.
                </Typography>
                <Alert severity="info">
                  This may take a few minutes to prepare your export file.
                </Alert>
              </Box>
            )}
            {dialogType === 'reset' && (
              <Box>
                <Typography variant="body1" paragraph>
                  This will reset all settings to their default values. This action cannot be undone.
                </Typography>
                <Alert severity="warning">
                  Your profile information will be preserved, but all preferences will be lost.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color={dialogType === 'reset' ? 'error' : 'primary'}
              onClick={() => {
                setShowDialog(false);
                showSnackbar(
                  dialogType === 'export' ? 'Export started' : 'Settings reset successfully',
                  'success'
                );
              }}
            >
              {dialogType === 'export' && 'Export'}
              {dialogType === 'reset' && 'Reset'}
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

export default Settings;