const express = require('express');
const router = express.Router();

// Simple authentication middleware (you can enhance this later)
const isAuthenticated = (req, res, next) => {
  // For development - allowing all requests
  // TODO: Implement proper JWT authentication
  next();
};

// Sample data matching your frontend structure
const users = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@acmecorp.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    organization: 'ACME Corporation',
    status: 'active',
    lastActive: '2 hours ago',
    joinDate: '2024-01-15',
    permissions: ['inventory_view', 'inventory_edit', 'users_manage', 'reports_view', 'analytics_access'],
    location: 'New York, NY',
    loginCount: 142,
    deviceCount: 3,
    twoFactorEnabled: true,
    emailVerified: true,
    notes: 'Inventory System Administrator'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techstart.com',
    phone: '+1 (555) 234-5678',
    role: 'manager',
    organization: 'TechStart Inc',
    status: 'active',
    lastActive: '1 day ago',
    joinDate: '2024-02-20',
    permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'scanner_access'],
    location: 'Los Angeles, CA',
    loginCount: 89,
    deviceCount: 2,
    twoFactorEnabled: true,
    emailVerified: true,
    notes: 'Warehouse Manager'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@retailco.com',
    phone: '+1 (555) 345-6789',
    role: 'operator',
    organization: 'RetailCo',
    status: 'active',
    lastActive: '3 hours ago',
    joinDate: '2024-03-10',
    permissions: ['inventory_view', 'scanner_access', 'basic_reports'],
    location: 'Chicago, IL',
    loginCount: 67,
    deviceCount: 1,
    twoFactorEnabled: false,
    emailVerified: true,
    notes: 'Inventory Operator'
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@globalstore.com',
    phone: '',
    role: 'viewer',
    organization: 'Global Store Ltd',
    status: 'inactive',
    lastActive: '1 week ago',
    joinDate: '2024-01-25',
    permissions: ['inventory_view', 'basic_reports'],
    location: '',
    loginCount: 23,
    deviceCount: 1,
    twoFactorEnabled: false,
    emailVerified: false,
    notes: 'Read-only access for reporting'
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@acmecorp.com',
    phone: '+1 (555) 456-7890',
    role: 'supervisor',
    organization: 'ACME Corporation',
    status: 'active',
    lastActive: '30 minutes ago',
    joinDate: '2024-02-01',
    permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'analytics_access', 'team_manage'],
    location: 'San Francisco, CA',
    loginCount: 156,
    deviceCount: 2,
    twoFactorEnabled: true,
    emailVerified: true,
    notes: 'Regional Supervisor'
  }
];

const organizations = [
  'ACME Corporation', 'TechStart Inc', 'RetailCo', 'Global Store Ltd', 
  'Supply Chain Pro', 'Warehouse Solutions', 'Inventory Masters'
];

const roles = [
  { 
    value: 'super_admin', 
    label: 'Super Admin', 
    description: 'Full system access across all organizations', 
    permissions: ['all'],
    scope: 'global'
  },
  { 
    value: 'admin', 
    label: 'Organization Admin', 
    description: 'Full access within their organization', 
    permissions: ['inventory_view', 'inventory_edit', 'inventory_delete', 'users_manage', 'reports_view', 'analytics_access', 'settings_manage'], 
    scope: 'organization'
  },
  { 
    value: 'manager', 
    label: 'Inventory Manager', 
    description: 'Manage inventory and view reports', 
    permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'scanner_access', 'analytics_access'], 
    scope: 'organization'
  },
  { 
    value: 'supervisor', 
    label: 'Supervisor', 
    description: 'Supervise operations and manage team', 
    permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'analytics_access', 'team_manage'], 
    scope: 'organization'
  },
  { 
    value: 'operator', 
    label: 'Inventory Operator', 
    description: 'Daily inventory operations and scanning', 
    permissions: ['inventory_view', 'scanner_access', 'basic_reports'], 
    scope: 'organization'
  },
  { 
    value: 'viewer', 
    label: 'Read-Only User', 
    description: 'View-only access to inventory and reports', 
    permissions: ['inventory_view', 'basic_reports'], 
    scope: 'organization'
  }
];

const permissions = [
  { id: 'inventory_view', label: 'View Inventory', description: 'View inventory items and stock levels', category: 'Inventory' },
  { id: 'inventory_edit', label: 'Edit Inventory', description: 'Add, edit, and update inventory items', category: 'Inventory' },
  { id: 'inventory_delete', label: 'Delete Inventory', description: 'Remove inventory items permanently', category: 'Inventory' },
  { id: 'scanner_access', label: 'Barcode Scanner', description: 'Access mobile scanning features', category: 'Operations' },
  { id: 'reports_view', label: 'Advanced Reports', description: 'Generate and view detailed reports', category: 'Reporting' },
  { id: 'basic_reports', label: 'Basic Reports', description: 'View basic inventory reports', category: 'Reporting' },
  { id: 'analytics_access', label: 'Analytics Dashboard', description: 'Access analytics and insights', category: 'Analytics' },
  { id: 'users_manage', label: 'User Management', description: 'Manage organization users', category: 'Administration' },
  { id: 'team_manage', label: 'Team Management', description: 'Manage team members and assignments', category: 'Administration' },
  { id: 'settings_manage', label: 'System Settings', description: 'Configure organization settings', category: 'Administration' },
  { id: 'audit_logs', label: 'Audit Logs', description: 'View system audit trails', category: 'Security' }
];

// GET /api/users - Get all users with filtering
router.get('/', (req, res, next) => { 
  console.log('GET /api/users/'); 
  next(); 
}, isAuthenticated, async (req, res) => {
  try {
    const { search, role, organization, status } = req.query;
    
    let filteredUsers = users;
    
    // Apply filters
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.organization.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (organization && organization !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.organization === organization);
    }
    
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    res.json({
      success: true,
      data: {
        users: filteredUsers,
        total: filteredUsers.length,
        stats: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'active').length,
          organizations: organizations.length,
          adminUsers: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/:id - Get specific user
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users - Create new user (invite)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, email, role, organization, permissions, message } = req.body;
    
    // Check if user with email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email,
      phone: '',
      role,
      organization,
      status: 'pending',
      lastActive: 'Never',
      joinDate: new Date().toISOString().split('T')[0],
      permissions: permissions || roles.find(r => r.value === role)?.permissions || [],
      location: '',
      loginCount: 0,
      deviceCount: 0,
      twoFactorEnabled: false,
      emailVerified: false,
      notes: message || ''
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: `Invitation sent to ${email}`,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...req.body };
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/users/:id/status - Toggle user status
router.put('/:id/status', isAuthenticated, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Toggle status
    users[userIndex].status = users[userIndex].status === 'active' ? 'inactive' : 'active';
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/organizations - Get all organizations
router.get('/meta/organizations', isAuthenticated, async (req, res) => {
  try {
    const orgStats = organizations.map(org => {
      const orgUsers = users.filter(u => u.organization === org);
      return {
        name: org,
        userCount: orgUsers.length,
        activeUsers: orgUsers.filter(u => u.status === 'active').length,
        adminUsers: orgUsers.filter(u => ['admin', 'super_admin'].includes(u.role)).length,
        twoFactorEnabled: orgUsers.filter(u => u.twoFactorEnabled).length
      };
    });
    
    res.json({ success: true, data: orgStats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/roles - Get all roles
router.get('/meta/roles', isAuthenticated, async (req, res) => {
  try {
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/permissions - Get all permissions
router.get('/meta/permissions', isAuthenticated, async (req, res) => {
  try {
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/activity - Get user activity logs
router.get('/activity/recent', isAuthenticated, async (req, res) => {
  try {
    const activities = [
      { 
        time: '2 hours ago', 
        action: 'Jane Smith logged into inventory system', 
        detail: 'TechStart Inc - Chrome on MacOS', 
        type: 'login', 
        user: 'Jane Smith' 
      },
      { 
        time: '4 hours ago', 
        action: 'New user invited to ACME Corporation', 
        detail: 'alex.brown@acmecorp.com - Inventory Manager role', 
        type: 'invite', 
        user: 'John Doe' 
      },
      { 
        time: '1 day ago', 
        action: 'Mike Johnson updated inventory permissions', 
        detail: 'Added scanner access for RetailCo team', 
        type: 'permission', 
        user: 'Admin' 
      },
      { 
        time: '2 days ago', 
        action: 'Sarah Wilson account deactivated', 
        detail: 'Global Store Ltd - Temporary suspension', 
        type: 'deactivate', 
        user: 'System' 
      },
      { 
        time: '3 days ago', 
        action: 'David Chen promoted to Supervisor', 
        detail: 'ACME Corporation - Team management permissions added', 
        type: 'role_change', 
        user: 'John Doe' 
      }
    ];
    
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;