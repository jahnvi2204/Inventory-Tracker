import React, { useState, useEffect } from 'react';
import { 
  Search, Users, BarChart3, Shield, Grid3X3, List, UserPlus, 
  UserX, User as UserIcon, Clock, MoreHorizontal, Mail, Moon, Sun, X, 
  ChevronDown, MapPin, Timer, Users2, Eye, UserCheck, Crown, 
  Edit, Key, Trash2, Phone, Home, Download, History, Check,
  Package, Building2, Scan, FileText, Settings, Activity
} from 'lucide-react';
import { useThemeMode } from '../context/ThemeContext';

const UsersPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterOrganization, setFilterOrganization] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteStep, setInviteStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [inviteData, setInviteData] = useState({
    email: '', firstName: '', lastName: '', role: 'viewer', organization: '',
    permissions: [], message: '', sendWelcomeEmail: true
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Auto-close snackbar after 4 seconds
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar({ open: false, message: '', severity: 'success' });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const [users] = useState([
    {
      id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@acmecorp.com',
      phone: '+1 (555) 123-4567', role: 'admin', organization: 'ACME Corporation',
      status: 'active', lastActive: '2 hours ago', joinDate: '2024-01-15',
      permissions: ['inventory_view', 'inventory_edit', 'users_manage', 'reports_view', 'analytics_access'],
      location: 'New York, NY', loginCount: 142, deviceCount: 3,
      twoFactorEnabled: true, emailVerified: true, notes: 'Inventory System Administrator'
    },
    {
      id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@techstart.com',
      phone: '+1 (555) 234-5678', role: 'manager', organization: 'TechStart Inc',
      status: 'active', lastActive: '1 day ago', joinDate: '2024-02-20',
      permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'scanner_access'],
      location: 'Los Angeles, CA', loginCount: 89, deviceCount: 2,
      twoFactorEnabled: true, emailVerified: true, notes: 'Warehouse Manager'
    },
    {
      id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@retailco.com',
      phone: '+1 (555) 345-6789', role: 'operator', organization: 'RetailCo',
      status: 'active', lastActive: '3 hours ago', joinDate: '2024-03-10',
      permissions: ['inventory_view', 'scanner_access', 'basic_reports'],
      location: 'Chicago, IL', loginCount: 67, deviceCount: 1,
      twoFactorEnabled: false, emailVerified: true, notes: 'Inventory Operator'
    },
    {
      id: 4, firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.wilson@globalstore.com',
      phone: '', role: 'viewer', organization: 'Global Store Ltd',
      status: 'inactive', lastActive: '1 week ago', joinDate: '2024-01-25',
      permissions: ['inventory_view', 'basic_reports'],
      location: '', loginCount: 23, deviceCount: 1,
      twoFactorEnabled: false, emailVerified: false, notes: 'Read-only access for reporting'
    },
    {
      id: 5, firstName: 'David', lastName: 'Chen', email: 'david.chen@acmecorp.com',
      phone: '+1 (555) 456-7890', role: 'supervisor', organization: 'ACME Corporation',
      status: 'active', lastActive: '30 minutes ago', joinDate: '2024-02-01',
      permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'analytics_access', 'team_manage'],
      location: 'San Francisco, CA', loginCount: 156, deviceCount: 2,
      twoFactorEnabled: true, emailVerified: true, notes: 'Regional Supervisor'
    }
  ]);

  const organizations = [
    'ACME Corporation', 'TechStart Inc', 'RetailCo', 'Global Store Ltd', 
    'Supply Chain Pro', 'Warehouse Solutions', 'Inventory Masters'
  ];

  const roles = [
    { 
      value: 'super_admin', label: 'Super Admin', 
      description: 'Full system access across all organizations', 
      color: 'red', 
      permissions: ['all'],
      icon: Crown,
      scope: 'global'
    },
    { 
      value: 'admin', label: 'Organization Admin', 
      description: 'Full access within their organization', 
      color: 'orange', 
      permissions: ['inventory_view', 'inventory_edit', 'inventory_delete', 'users_manage', 'reports_view', 'analytics_access', 'settings_manage'], 
      icon: UserCheck,
      scope: 'organization'
    },
    { 
      value: 'manager', label: 'Inventory Manager', 
      description: 'Manage inventory and view reports', 
      color: 'blue', 
      permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'scanner_access', 'analytics_access'], 
      icon: Users2,
      scope: 'organization'
    },
    { 
      value: 'supervisor', label: 'Supervisor', 
      description: 'Supervise operations and manage team', 
      color: 'purple', 
      permissions: ['inventory_view', 'inventory_edit', 'reports_view', 'analytics_access', 'team_manage'], 
      icon: Shield,
      scope: 'organization'
    },
    { 
      value: 'operator', label: 'Inventory Operator', 
      description: 'Daily inventory operations and scanning', 
      color: 'green', 
      permissions: ['inventory_view', 'scanner_access', 'basic_reports'], 
      icon: Scan,
      scope: 'organization'
    },
    { 
      value: 'viewer', label: 'Read-Only User', 
      description: 'View-only access to inventory and reports', 
      color: 'gray', 
      permissions: ['inventory_view', 'basic_reports'], 
      icon: Eye,
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesOrg = filterOrganization === 'all' || user.organization === filterOrganization;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesOrg && matchesStatus;
  });

  const handleInviteUser = () => {
    setShowInviteDialog(false);
    setInviteStep(0);
    setInviteData({
      email: '', firstName: '', lastName: '', role: 'viewer', organization: '',
      permissions: [], message: '', sendWelcomeEmail: true
    });
    showSnackbar(`Invitation sent to ${inviteData.email}`, 'success');
  };

  const handleToggleUserStatus = (userId) => {
    showSnackbar('User status updated', 'success');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    switch(roleObj?.color) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'green': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Inventory System - User Management
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage users, roles, and permissions across organizations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Dashboard</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>/</span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>User Management</span>
              </nav>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Users', value: users.length, change: '+12 this month', icon: Users, color: 'blue' },
            { title: 'Active Users', value: users.filter(u => u.status === 'active').length, change: '87% active rate', icon: Check, color: 'green' },
            { title: 'Organizations', value: organizations.length, change: '2 new this quarter', icon: Building2, color: 'purple' },
            { title: 'Admin Users', value: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length, change: 'Secure access', icon: Shield, color: 'orange' },
          ].map((stat, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={filterOrganization}
                onChange={(e) => setFilterOrganization(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
                darkMode 
                  ? 'border-gray-600 text-gray-400 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setShowInviteDialog(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite User
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1">
            {[
              { icon: Users, label: 'All Users' },
              { icon: BarChart3, label: 'Organizations' },
              { icon: Shield, label: 'Permissions' },
              { icon: History, label: 'Activity' }
            ].map((tab, index) => (
              <button
                key={index}
                onClick={() => setCurrentTab(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  currentTab === index
                    ? 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Tab */}
        {currentTab === 0 && (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                  <div key={user.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                            darkMode ? 'border-gray-800' : 'border-white'
                          } ${
                            user.status === 'active' ? 'bg-green-500' : 
                            user.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div>
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {roles.find(r => r.value === user.role)?.label || user.role}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center gap-1`}>
                            <Building2 className="w-3 h-3" />
                            {user.organization}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserMenu(!showUserMenu);
                          }}
                          className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {user.phone || 'No phone'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {user.location || 'No location'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-gray-400" />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {user.lastActive}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${user.twoFactorEnabled ? 'text-green-500' : 'text-yellow-500'}`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {user.twoFactorEnabled ? '2FA On' : '2FA Off'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Joined {user.joinDate}
                        </span>
                        <div className="flex gap-1">
                          <button className="p-1 rounded-lg text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`p-1 rounded-lg ${
                              user.status === 'active' 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          User
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Role & Organization
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Status & Security
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last Active
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="relative">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {user.firstName[0]}{user.lastName[0]}
                                  </span>
                                </div>
                                <div className={`absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 ${
                                  darkMode ? 'border-gray-800' : 'border-white'
                                } ${
                                  user.status === 'active' ? 'bg-green-500' : 
                                  user.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                              </div>
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {roles.find(r => r.value === user.role)?.label || user.role}
                            </span>
                            <div className={`text-sm mt-1 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Building2 className="w-3 h-3" />
                              {user.organization}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                            {user.twoFactorEnabled && (
                              <div className="flex items-center mt-1">
                                <Shield className="w-3 h-3 text-green-500 mr-1" />
                                <span className="text-xs text-green-600">2FA</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.lastActive}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {user.loginCount} logins
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={user.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                              >
                                {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Organizations Tab */}
        {currentTab === 1 && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Organizations Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {organizations.map((org) => {
                  const orgUsers = users.filter(u => u.organization === org);
                  const activeUsers = orgUsers.filter(u => u.status === 'active').length;
                  return (
                    <div key={org} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {org}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {orgUsers.length} users
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Active</span>
                          <span className="text-green-600 font-medium">{activeUsers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Admins</span>
                          <span className="text-orange-600 font-medium">
                            {orgUsers.filter(u => ['admin', 'super_admin'].includes(u.role)).length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>2FA Enabled</span>
                          <span className="text-blue-600 font-medium">
                            {orgUsers.filter(u => u.twoFactorEnabled).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  User Distribution by Role
                </h3>
                <div className="space-y-3">
                  {roles.map((role) => {
                    const roleCount = users.filter(u => u.role === role.value).length;
                    const percentage = users.length > 0 ? Math.round((roleCount / users.length) * 100) : 0;
                    return (
                      <div key={role.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <role.icon className="w-4 h-4 text-blue-600" />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {role.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="h-full bg-blue-600 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} w-8`}>
                            {roleCount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Security Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Two-Factor Authentication</span>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {users.filter(u => u.twoFactorEnabled).length}/{users.length}
                      </div>
                      <div className="text-xs text-green-600">
                        {Math.round((users.filter(u => u.twoFactorEnabled).length / users.length) * 100)}% enabled
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email Verified</span>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {users.filter(u => u.emailVerified).length}/{users.length}
                      </div>
                      <div className="text-xs text-blue-600">
                        {Math.round((users.filter(u => u.emailVerified).length / users.length) * 100)}% verified
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Sessions</span>
                    <div className="text-right">
                      <div className={`text-lg font-bold text-green-600`}>
                        {users.filter(u => u.status === 'active').length}
                      </div>
                      <div className="text-xs text-green-600">
                        Currently online
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {currentTab === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Role Management
              </h3>
              <div className="space-y-4">
                {roles.map((role) => (
                  <details key={role.value} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <summary className="p-4 cursor-pointer flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <role.icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {role.label}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {users.filter(u => u.role === role.value).length} users • {role.scope}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.value)}`}>
                        {role.color}
                      </span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {role.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm) => (
                          <span key={perm} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            {perm === 'all' ? 'All Permissions' : permissions.find(p => p.id === perm)?.label || perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Permission Categories
              </h3>
              <div className="space-y-4">
                {['Inventory', 'Operations', 'Reporting', 'Analytics', 'Administration', 'Security'].map((category) => {
                  const categoryPerms = permissions.filter(p => p.category === category);
                  return (
                    <div key={category} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {categoryPerms.map((perm) => (
                          <div key={perm.id} className="flex items-center justify-between">
                            <div>
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {perm.label}
                              </span>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {perm.description}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                              {users.filter(u => u.permissions.includes(perm.id)).length} users
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {currentTab === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent User Activity
              </h3>
              <div className="space-y-4">
                {[
                  { time: '2 hours ago', action: 'Jane Smith logged into inventory system', detail: 'TechStart Inc - Chrome on MacOS', type: 'login', user: 'Jane Smith' },
                  { time: '4 hours ago', action: 'New user invited to ACME Corporation', detail: 'alex.brown@acmecorp.com - Inventory Manager role', type: 'invite', user: 'John Doe' },
                  { time: '1 day ago', action: 'Mike Johnson updated inventory permissions', detail: 'Added scanner access for RetailCo team', type: 'permission', user: 'Admin' },
                  { time: '2 days ago', action: 'Sarah Wilson account deactivated', detail: 'Global Store Ltd - Temporary suspension', type: 'deactivate', user: 'System' },
                  { time: '3 days ago', action: 'David Chen promoted to Supervisor', detail: 'ACME Corporation - Team management permissions added', type: 'role_change', user: 'John Doe' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'login' ? 'bg-green-100' :
                      activity.type === 'invite' ? 'bg-blue-100' :
                      activity.type === 'permission' ? 'bg-purple-100' : 
                      activity.type === 'role_change' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {activity.type === 'login' && <Check className="w-4 h-4 text-green-600" />}
                      {activity.type === 'invite' && <UserPlus className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'permission' && <Shield className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'role_change' && <Users2 className="w-4 h-4 text-yellow-600" />}
                      {activity.type === 'deactivate' && <UserX className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.action}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.detail}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {activity.time} • by {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  System Health
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Sessions</span>
                    <span className={`text-sm font-medium text-green-600`}>
                      {users.filter(u => u.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Failed Logins (24h)</span>
                    <span className={`text-sm font-medium text-red-600`}>
                      3
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending Invites</span>
                    <span className={`text-sm font-medium text-yellow-600`}>
                      {users.filter(u => u.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Security Score</span>
                    <span className={`text-sm font-medium text-green-600`}>
                      85%
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Invite New User</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Export User Report</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Manage Permissions</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* User Menu */}
      {showUserMenu && selectedUser && (
        <div className="fixed inset-0 z-50" onClick={() => setShowUserMenu(false)}>
          <div className="absolute top-20 right-6">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg py-2 min-w-48`}>
              <button className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                <Edit className="w-4 h-4" />
                Edit User Profile
              </button>
              <button className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                <Shield className="w-4 h-4" />
                Manage Permissions
              </button>
              <button className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                <Key className="w-4 h-4" />
                Reset Password
              </button>
              <button className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                <Activity className="w-4 h-4" />
                View Activity Log
              </button>
              <button className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                <Mail className="w-4 h-4" />
                Send Message
              </button>
              <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
              <button
                onClick={() => {
                  handleToggleUserStatus(selectedUser.id);
                  setShowUserMenu(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                {selectedUser.status === 'active' ? <UserX className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </button>
              <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="p-6 border-b border-gray-200">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Invite User to Inventory System
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add a new team member to manage inventory and operations
              </p>
            </div>
            
            <div className="p-6">
              {/* Step indicators */}
              <div className="flex items-center mb-8">
                {['User Details', 'Organization & Role', 'Permissions'].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= inviteStep 
                        ? 'bg-blue-600 text-white' 
                        : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`ml-2 text-sm ${
                      index <= inviteStep 
                        ? darkMode ? 'text-white' : 'text-gray-900'
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                    {index < 2 && <div className={`w-12 h-0.5 mx-4 ${
                      index < inviteStep ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>}
                  </div>
                ))}
              </div>

              {/* Step 1: User Details */}
              {inviteStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={inviteData.lastName}
                        onChange={(e) => setInviteData({...inviteData, lastName: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Organization & Role */}
              {inviteStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Organization
                    </label>
                    <select
                      value={inviteData.organization}
                      onChange={(e) => setInviteData({...inviteData, organization: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select Organization</option>
                      {organizations.map((org) => (
                        <option key={org} value={org}>{org}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Select Role
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roles.filter(role => role.scope === 'organization').map((role) => (
                        <div
                          key={role.value}
                          onClick={() => setInviteData({...inviteData, role: role.value, permissions: role.permissions})}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            inviteData.role === role.value
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : darkMode 
                                ? 'border-gray-600 hover:border-gray-500' 
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <role.icon className="w-5 h-5 text-blue-600" />
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {role.label}
                            </h4>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {role.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Permissions */}
              {inviteStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Customize Permissions
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Review and customize the permissions for this user. Default permissions are based on the selected role.
                    </p>
                    
                    <div className="space-y-4">
                      {['Inventory', 'Operations', 'Reporting', 'Analytics', 'Administration', 'Security'].map((category) => {
                        const categoryPerms = permissions.filter(p => p.category === category);
                        return (
                          <div key={category} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                            <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {category}
                            </h4>
                            <div className="space-y-2">
                              {categoryPerms.map((perm) => (
                                <label key={perm.id} className="flex items-start gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={inviteData.permissions.includes(perm.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setInviteData({
                                          ...inviteData,
                                          permissions: [...inviteData.permissions, perm.id]
                                        });
                                      } else {
                                        setInviteData({
                                          ...inviteData,
                                          permissions: inviteData.permissions.filter(p => p !== perm.id)
                                        });
                                      }
                                    }}
                                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <div>
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {perm.label}
                                    </span>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {perm.description}
                                    </p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Welcome Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={inviteData.message}
                      onChange={(e) => setInviteData({...inviteData, message: e.target.value})}
                      placeholder="Add a personal welcome message..."
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="welcomeEmail"
                      checked={inviteData.sendWelcomeEmail}
                      onChange={(e) => setInviteData({...inviteData, sendWelcomeEmail: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="welcomeEmail" className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Send welcome email with login instructions
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between`}>
              <button
                onClick={() => {
                  setShowInviteDialog(false);
                  setInviteStep(0);
                }}
                className={`px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'text-gray-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                {inviteStep > 0 && (
                  <button
                    onClick={() => setInviteStep(inviteStep - 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Back
                  </button>
                )}
                {inviteStep < 2 ? (
                  <button
                    onClick={() => setInviteStep(inviteStep + 1)}
                    disabled={
                      (inviteStep === 0 && (!inviteData.firstName || !inviteData.lastName || !inviteData.email)) ||
                      (inviteStep === 1 && (!inviteData.organization || !inviteData.role))
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleInviteUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Invitation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
            snackbar.severity === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            <Check className="w-4 h-4" />
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar({ open: false, message: '', severity: 'success' })}
              className="ml-2 hover:bg-black hover:bg-opacity-20 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage; 