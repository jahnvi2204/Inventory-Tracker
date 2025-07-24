import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuItemMUI,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import {
  Search,
  Users,
  Grid3X3,
  List as ListIcon,
  UserPlus,
  UserX,
  User as UserIcon,
  MoreHorizontal,
  Mail,
  Phone,
  Home,
  Download,
  Check,
  Package,
  Building2,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../context/ThemeContext';

const UsersPage = () => {
  const theme = useTheme();
  const { darkMode } = useThemeMode();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrganization, setFilterOrganization] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [inviteData, setInviteData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    organization: '',
    phone: ''
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const [users] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acmecorp.com',
      phone: '+1 (555) 123-4567',
      organization: 'ACME Corporation',
      status: 'active',
      lastActive: '2 hours ago',
      joinDate: '2024-01-15',
      location: 'New York, NY'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@techstart.com',
      phone: '+1 (555) 234-5678',
      organization: 'TechStart Inc',
      status: 'active',
      lastActive: '1 day ago',
      joinDate: '2024-02-20',
      location: 'Los Angeles, CA'
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@retailco.com',
      phone: '+1 (555) 345-6789',
      organization: 'RetailCo',
      status: 'active',
      lastActive: '3 hours ago',
      joinDate: '2024-03-10',
      location: 'Chicago, IL'
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@globalstore.com',
      phone: '+1 (555) 456-7890',
      organization: 'Global Store Ltd',
      status: 'inactive',
      lastActive: '1 week ago',
      joinDate: '2024-01-25',
      location: 'Boston, MA'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@acmecorp.com',
      phone: '+1 (555) 567-8901',
      organization: 'ACME Corporation',
      status: 'active',
      lastActive: '30 minutes ago',
      joinDate: '2024-02-01',
      location: 'San Francisco, CA'
    }
  ]);

  const organizations = [
    'ACME Corporation',
    'TechStart Inc',
    'RetailCo',
    'Global Store Ltd',
    'Supply Chain Pro',
    'Warehouse Solutions',
    'Inventory Masters'
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = filterOrganization === 'all' || user.organization === filterOrganization;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesOrg && matchesStatus;
  });

  const handleInviteUser = () => {
    setShowInviteDialog(false);
    setInviteData({
      email: '',
      firstName: '',
      lastName: '',
      organization: '',
      phone: ''
    });
    showSnackbar(`User ${inviteData.firstName} ${inviteData.lastName} has been added successfully`, 'success');
  };

  const handleToggleUserStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    showSnackbar(`User ${user.firstName} ${user.lastName} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'success');
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Package color={theme.palette.primary.main} size={24} />
              <Users color={theme.palette.primary.main} size={32} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage users and their organizations
              </Typography>
            </Box>
          </Box>

          <Breadcrumbs>
            <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Home size={16} />
              Dashboard
            </Link>
            <Typography color="text.primary">User Management</Typography>
          </Breadcrumbs>
        </Box>
      </Paper>

      {/* User Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {users.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    +12 this month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <Users size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {users.filter(u => u.status === 'active').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    87% active rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <Check size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Organizations
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {organizations.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2 new this quarter
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  <Building2 size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Inactive Users
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {users.filter(u => u.status === 'inactive').length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Need attention
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  <UserX size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Organization</InputLabel>
              <Select
                value={filterOrganization}
                onChange={(e) => setFilterOrganization(e.target.value)}
                label="Organization"
              >
                <MenuItem value="all">All Organizations</MenuItem>
                {organizations.map((org) => (
                  <MenuItem key={org} value={org}>{org}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <IconButton 
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={20} />
              </IconButton>
              <IconButton 
                color={viewMode === 'table' ? 'primary' : 'default'}
                onClick={() => setViewMode('table')}
              >
                <ListIcon size={20} />
              </IconButton>
              <Button variant="outlined" startIcon={<Download size={16} />}>
                Export
              </Button>
              <Button 
                variant="contained" 
                startIcon={<UserPlus size={16} />}
                onClick={() => setShowInviteDialog(true)}
              >
                Add User
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Display */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton 
                      onClick={(e) => handleMenuOpen(e, user)}
                      size="small"
                    >
                      <MoreHorizontal size={16} />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={user.status} 
                      color={getStatusColor(user.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Building2 size={14} />
                      {user.organization}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Phone size={14} />
                      {user.phone || 'No phone'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Activity size={14} />
                      Last active: {user.lastActive}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Joined {user.joinDate}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" color="primary">
                        <Edit size={14} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color={user.status === 'active' ? 'warning' : 'success'}
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? <UserX size={14} /> : <UserIcon size={14} />}
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Building2 size={14} />
                        {user.organization}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.phone || 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.lastActive}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Joined {user.joinDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" color="primary">
                          <Edit size={16} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color={user.status === 'active' ? 'warning' : 'success'}
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? <UserX size={16} /> : <UserIcon size={16} />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreHorizontal size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
          },
        }}
      >
        <MenuItemMUI onClick={handleMenuClose}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Edit User
        </MenuItemMUI>
        <MenuItemMUI onClick={handleMenuClose}>
          <Mail size={16} style={{ marginRight: 8 }} />
          Send Message
        </MenuItemMUI>
        <MenuItemMUI onClick={handleMenuClose}>
          <Activity size={16} style={{ marginRight: 8 }} />
          View Activity
        </MenuItemMUI>
        <Divider />
        <MenuItemMUI 
          onClick={() => {
            if (selectedUser) {
              handleToggleUserStatus(selectedUser.id);
            }
            handleMenuClose();
          }}
        >
          {selectedUser?.status === 'active' ? (
            <>
              <UserX size={16} style={{ marginRight: 8 }} />
              Deactivate User
            </>
          ) : (
            <>
              <UserIcon size={16} style={{ marginRight: 8 }} />
              Activate User
            </>
          )}
        </MenuItemMUI>
        <MenuItemMUI onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete User
        </MenuItemMUI>
      </Menu>

      {/* Add User Dialog */}
      <Dialog open={showInviteDialog} onClose={() => setShowInviteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={inviteData.firstName}
                  onChange={(e) => setInviteData({...inviteData, firstName: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={inviteData.lastName}
                  onChange={(e) => setInviteData({...inviteData, lastName: e.target.value})}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={inviteData.email}
              onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={inviteData.phone}
              onChange={(e) => setInviteData({...inviteData, phone: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel>Organization</InputLabel>
              <Select
                value={inviteData.organization}
                onChange={(e) => setInviteData({...inviteData, organization: e.target.value})}
                label="Organization"
              >
                {organizations.map((org) => (
                  <MenuItem key={org} value={org}>{org}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInviteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleInviteUser}
            variant="contained"
            disabled={!inviteData.firstName || !inviteData.lastName || !inviteData.email || !inviteData.organization}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;