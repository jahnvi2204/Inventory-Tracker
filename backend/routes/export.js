const express = require('express');
const router = express.Router();

// Simple authentication middleware
const isAuthenticated = (req, res, next) => {
  // For development - allowing all requests
  // TODO: Implement proper JWT authentication
  next();
};

// Sample data (in production, this would come from your database)
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
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Organization Admin' },
  { value: 'manager', label: 'Inventory Manager' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'operator', label: 'Inventory Operator' },
  { value: 'viewer', label: 'Read-Only User' }
];

// Helper function to generate CSV content
const generateCSV = (data, headers) => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle arrays (like permissions)
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value || '';
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Helper function to generate JSON content
const generateJSON = (data) => {
  return JSON.stringify(data, null, 2);
};

// Helper function to filter users based on query parameters
const filterUsers = (req) => {
  const { search, role, organization, status } = req.query;
  let filteredUsers = [...users];
  
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
  
  return filteredUsers;
};

// GET /api/export/users - Export users data
router.get('/users', isAuthenticated, async (req, res) => {
  try {
    const { format = 'csv', fields } = req.query;
    const filteredUsers = filterUsers(req);
    
    // Define available fields
    const allFields = [
      'id', 'firstName', 'lastName', 'email', 'phone', 'role', 
      'organization', 'status', 'lastActive', 'joinDate', 'permissions',
      'location', 'loginCount', 'deviceCount', 'twoFactorEnabled', 
      'emailVerified', 'notes'
    ];
    
    // Use specified fields or all fields
    const exportFields = fields ? fields.split(',') : allFields;
    
    // Prepare data for export
    const exportData = filteredUsers.map(user => {
      const filteredUser = {};
      exportFields.forEach(field => {
        if (allFields.includes(field)) {
          filteredUser[field] = user[field];
        }
      });
      return filteredUser;
    });
    
    if (format === 'csv') {
      const csvContent = generateCSV(exportData, exportFields);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else if (format === 'json') {
      const jsonContent = generateJSON(exportData);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.json"`);
      res.send(jsonContent);
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid format. Supported formats: csv, json' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/export/organizations - Export organization statistics
router.get('/organizations', isAuthenticated, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const orgStats = organizations.map(org => {
      const orgUsers = users.filter(u => u.organization === org);
      return {
        organization: org,
        totalUsers: orgUsers.length,
        activeUsers: orgUsers.filter(u => u.status === 'active').length,
        inactiveUsers: orgUsers.filter(u => u.status === 'inactive').length,
        pendingUsers: orgUsers.filter(u => u.status === 'pending').length,
        adminUsers: orgUsers.filter(u => ['admin', 'super_admin'].includes(u.role)).length,
        managersUsers: orgUsers.filter(u => u.role === 'manager').length,
        operatorUsers: orgUsers.filter(u => u.role === 'operator').length,
        viewerUsers: orgUsers.filter(u => u.role === 'viewer').length,
        twoFactorEnabled: orgUsers.filter(u => u.twoFactorEnabled).length,
        emailVerified: orgUsers.filter(u => u.emailVerified).length
      };
    });
    
    if (format === 'csv') {
      const csvHeaders = [
        'organization', 'totalUsers', 'activeUsers', 'inactiveUsers', 'pendingUsers',
        'adminUsers', 'managersUsers', 'operatorUsers', 'viewerUsers', 
        'twoFactorEnabled', 'emailVerified'
      ];
      const csvContent = generateCSV(orgStats, csvHeaders);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="organizations_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else if (format === 'json') {
      const jsonContent = generateJSON(orgStats);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="organizations_export_${new Date().toISOString().split('T')[0]}.json"`);
      res.send(jsonContent);
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid format. Supported formats: csv, json' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/export/roles - Export role distribution
router.get('/roles', isAuthenticated, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const roleStats = roles.map(role => {
      const roleUsers = users.filter(u => u.role === role.value);
      return {
        role: role.label,
        roleValue: role.value,
        userCount: roleUsers.length,
        activeUsers: roleUsers.filter(u => u.status === 'active').length,
        percentage: users.length > 0 ? Math.round((roleUsers.length / users.length) * 100) : 0
      };
    });
    
    if (format === 'csv') {
      const csvHeaders = ['role', 'roleValue', 'userCount', 'activeUsers', 'percentage'];
      const csvContent = generateCSV(roleStats, csvHeaders);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="roles_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else if (format === 'json') {
      const jsonContent = generateJSON(roleStats);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="roles_export_${new Date().toISOString().split('T')[0]}.json"`);
      res.send(jsonContent);
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid format. Supported formats: csv, json' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/export/activity - Export user activity logs
router.get('/activity', isAuthenticated, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const activities = [
      { 
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        time: '2 hours ago', 
        action: 'Jane Smith logged into inventory system', 
        detail: 'TechStart Inc - Chrome on MacOS', 
        type: 'login', 
        user: 'Jane Smith',
        organization: 'TechStart Inc'
      },
      { 
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        time: '4 hours ago', 
        action: 'New user invited to ACME Corporation', 
        detail: 'alex.brown@acmecorp.com - Inventory Manager role', 
        type: 'invite', 
        user: 'John Doe',
        organization: 'ACME Corporation'
      },
      { 
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        time: '1 day ago', 
        action: 'Mike Johnson updated inventory permissions', 
        detail: 'Added scanner access for RetailCo team', 
        type: 'permission', 
        user: 'Admin',
        organization: 'RetailCo'
      },
      { 
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2 days ago', 
        action: 'Sarah Wilson account deactivated', 
        detail: 'Global Store Ltd - Temporary suspension', 
        type: 'deactivate', 
        user: 'System',
        organization: 'Global Store Ltd'
      },
      { 
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: '3 days ago', 
        action: 'David Chen promoted to Supervisor', 
        detail: 'ACME Corporation - Team management permissions added', 
        type: 'role_change', 
        user: 'John Doe',
        organization: 'ACME Corporation'
      }
    ];
    
    if (format === 'csv') {
      const csvHeaders = ['timestamp', 'time', 'action', 'detail', 'type', 'user', 'organization'];
      const csvContent = generateCSV(activities, csvHeaders);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="activity_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvContent);
    } else if (format === 'json') {
      const jsonContent = generateJSON(activities);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="activity_export_${new Date().toISOString().split('T')[0]}.json"`);
      res.send(jsonContent);
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid format. Supported formats: csv, json' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/export/summary - Export comprehensive summary report
router.get('/summary', isAuthenticated, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const summary = {
      reportGenerated: new Date().toISOString(),
      overview: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        inactiveUsers: users.filter(u => u.status === 'inactive').length,
        pendingUsers: users.filter(u => u.status === 'pending').length,
        totalOrganizations: organizations.length,
        usersWithTwoFactor: users.filter(u => u.twoFactorEnabled).length,
        verifiedEmails: users.filter(u => u.emailVerified).length
      },
      organizationBreakdown: organizations.map(org => {
        const orgUsers = users.filter(u => u.organization === org);
        return {
          name: org,
          userCount: orgUsers.length,
          activeUsers: orgUsers.filter(u => u.status === 'active').length,
          adminUsers: orgUsers.filter(u => ['admin', 'super_admin'].includes(u.role)).length
        };
      }),
      roleDistribution: roles.map(role => {
        const roleUsers = users.filter(u => u.role === role.value);
        return {
          role: role.label,
          count: roleUsers.length,
          percentage: users.length > 0 ? Math.round((roleUsers.length / users.length) * 100) : 0
        };
      }),
      securityMetrics: {
        twoFactorAdoption: Math.round((users.filter(u => u.twoFactorEnabled).length / users.length) * 100),
        emailVerificationRate: Math.round((users.filter(u => u.emailVerified).length / users.length) * 100),
        averageLoginCount: Math.round(users.reduce((sum, user) => sum + user.loginCount, 0) / users.length)
      }
    };
    
    if (format === 'json') {
      const jsonContent = generateJSON(summary);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="inventory_user_summary_${new Date().toISOString().split('T')[0]}.json"`);
      res.send(jsonContent);
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Summary report only available in JSON format' 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/export - List available export endpoints
router.get('/', isAuthenticated, async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Inventory User Management Export API',
      availableExports: {
        users: {
          endpoint: '/api/export/users',
          description: 'Export user data with filtering options',
          parameters: {
            format: 'csv or json (default: csv)',
            fields: 'comma-separated list of fields to include',
            search: 'search term for filtering',
            role: 'filter by role',
            organization: 'filter by organization',
            status: 'filter by status'
          }
        },
        organizations: {
          endpoint: '/api/export/organizations',
          description: 'Export organization statistics',
          parameters: {
            format: 'csv or json (default: csv)'
          }
        },
        roles: {
          endpoint: '/api/export/roles',
          description: 'Export role distribution data',
          parameters: {
            format: 'csv or json (default: csv)'
          }
        },
        activity: {
          endpoint: '/api/export/activity',
          description: 'Export user activity logs',
          parameters: {
            format: 'csv or json (default: csv)'
          }
        },
        summary: {
          endpoint: '/api/export/summary',
          description: 'Export comprehensive summary report',
          parameters: {
            format: 'json only'
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;