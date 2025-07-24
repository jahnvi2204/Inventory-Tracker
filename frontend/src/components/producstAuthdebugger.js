// src/components/ProductsAuthDebugger.js
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField
} from '@mui/material';
import { 
  Send, 
  CheckCircle, 
  Error, 
  Warning, 
  ExpandMore,
  BugReport 
} from '@mui/icons-material';
import api from '../services/api';

const ProductsAuthDebugger = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [customHeaders, setCustomHeaders] = useState('');

  const testSpecificEndpoints = async () => {
    setTesting(true);
    setTestResults({});
    
    const tests = [
      {
        name: 'Auth Status (working)',
        method: 'GET',
        url: '/auth/status',
        description: 'This should work - user session is valid'
      },
      {
        name: 'Products (failing)',
        method: 'GET', 
        url: '/products',
        description: 'This returns 401 despite valid session'
      },
      {
        name: 'Products with limit',
        method: 'GET',
        url: '/products?limit=5',
        description: 'Same endpoint with query params'
      },
      {
        name: 'User info',
        method: 'GET',
        url: '/user',
        description: 'Check if user endpoints work'
      },
      {
        name: 'User profile',
        method: 'GET',
        url: '/user/profile',
        description: 'Alternative user endpoint'
      },
      {
        name: 'Organizations',
        method: 'GET',
        url: '/organizations',
        description: 'Check organization-based endpoints'
      },
      {
        name: 'Current user org',
        method: 'GET',
        url: '/organizations/current',
        description: 'Current organization info'
      }
    ];

    for (const test of tests) {
      try {
        console.log(`🔍 Testing: ${test.name} - ${test.method} ${test.url}`);
        
        const config = {
          method: test.method.toLowerCase(),
          url: test.url,
        };

        // Add custom headers if provided
        if (customHeaders.trim()) {
          try {
            const headers = JSON.parse(customHeaders);
            config.headers = headers;
          } catch (e) {
            console.warn('Invalid custom headers JSON');
          }
        }

        const startTime = Date.now();
        const response = await api.request(config);
        const endTime = Date.now();
        
        setTestResults(prev => ({
          ...prev,
          [test.name]: {
            status: 'success',
            statusCode: response.status,
            responseTime: endTime - startTime,
            dataType: typeof response.data,
            dataSize: JSON.stringify(response.data).length,
            sampleData: JSON.stringify(response.data, null, 2).substring(0, 400) + '...',
            headers: response.headers,
            description: test.description,
            url: test.url
          }
        }));
        
      } catch (error) {
        console.error(`❌ ${test.name} failed:`, error);
        
        setTestResults(prev => ({
          ...prev,
          [test.name]: {
            status: 'error',
            statusCode: error.response?.status || 'network_error',
            error: error.response?.data?.message || error.message,
            errorData: error.response?.data,
            requestConfig: error.config,
            description: test.description,
            url: test.url
          }
        }));
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setTesting(false);
  };

  const analyzeAuthIssue = () => {
    const results = Object.entries(testResults);
    const authStatusWorks = results.find(([name]) => name.includes('Auth Status'))?.[1]?.status === 'success';
    const productsBlocked = results.filter(([name, result]) => 
      name.includes('Products') && result.statusCode === 401
    );
    
    let diagnosis = [];
    
    if (authStatusWorks && productsBlocked.length > 0) {
      diagnosis.push({
        type: 'warning',
        title: 'Authorization Middleware Issue',
        message: 'Session authentication works, but products endpoint has additional authorization checks that are failing.'
      });
      
      diagnosis.push({
        type: 'info',
        title: 'Possible Causes',
        message: `
          1. Role-based authorization (user role: staff, might need admin/manager)
          2. Organization-based authorization (user belongs to org: ${testResults['Auth Status']?.sampleData?.includes('organization') ? 'yes' : 'unknown'})
          3. Permission-based authorization (specific product permissions)
          4. Middleware order issue in backend
        `
      });
      
      diagnosis.push({
        type: 'success',
        title: 'Quick Fix Options',
        message: `
          Backend fixes needed:
          1. Check if products route requires specific roles
          2. Verify organization middleware isn't blocking access
          3. Ensure req.user is properly set before products middleware
          4. Check if products route needs isAuthenticated AND additional middleware
        `
      });
    }
    
    return diagnosis;
  };

  const getStatusIcon = (result) => {
    if (result.status === 'success') return <CheckCircle color="success" />;
    if (result.statusCode === 401) return <Warning color="warning" />;
    if (result.statusCode === 404) return <Error color="info" />;
    return <Error color="error" />;
  };

  const diagnosis = Object.keys(testResults).length > 0 ? analyzeAuthIssue() : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🔍 Products Authorization Debugger
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2">Current Issue:</Typography>
        <Typography variant="body2">
          • ✅ Auth Status: Working (304) - Session valid<br/>
          • ❌ Products: Failing (401) - Additional authorization required<br/>
          • 📡 Network: Rapid connect/disconnect (React StrictMode/re-renders)
        </Typography>
      </Alert>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Custom Headers (JSON)"
            placeholder='{"X-Organization-ID": "123", "X-Role": "admin"}'
            value={customHeaders}
            onChange={(e) => setCustomHeaders(e.target.value)}
            helperText="Test with additional headers that might be required"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            onClick={testSpecificEndpoints}
            disabled={testing}
            startIcon={<Send />}
            sx={{ height: '100%' }}
          >
            {testing ? 'Testing...' : 'Run Authorization Tests'}
          </Button>
        </Grid>
      </Grid>

      {/* Diagnosis */}
      {diagnosis.map((item, index) => (
        <Alert key={index} severity={item.type} sx={{ mb: 2 }}>
          <Typography variant="subtitle2">{item.title}</Typography>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {item.message}
          </Typography>
        </Alert>
      ))}

      {/* Test Results */}
      {Object.entries(testResults).map(([testName, result]) => (
        <Accordion key={testName} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {getStatusIcon(result)}
              <Chip
                label={result.statusCode}
                color={result.status === 'success' ? 'success' : result.statusCode === 401 ? 'warning' : 'error'}
                size="small"
              />
              <Typography sx={{ flexGrow: 1 }}>{testName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {result.url}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {result.description}
            </Typography>
            
            {result.status === 'success' ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ✅ Success Response:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Status: {result.statusCode} | Time: {result.responseTime}ms | Size: {result.dataSize} bytes
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    backgroundColor: 'success.light',
                    color: 'success.contrastText',
                    p: 2,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: 200
                  }}
                >
                  {result.sampleData}
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  ❌ Error Response:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Status: {result.statusCode} | Error: {result.error}
                </Typography>
                {result.errorData && (
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'error.light',
                      color: 'error.contrastText',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      overflow: 'auto',
                      maxHeight: 200
                    }}
                  >
                    {JSON.stringify(result.errorData, null, 2)}
                  </Box>
                )}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Backend Fix Recommendations */}
      {diagnosis.length > 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="subtitle2">🛠️ Backend Investigation Needed:</Typography>
          <Typography variant="body2" component="div">
            <strong>1. Check your products route middleware:</strong>
            <pre style={{ fontSize: '0.875rem', margin: '8px 0' }}>{`
// Look for something like this in your backend:
router.get('/products', 
  isAuthenticated,        // ✅ This works (auth/status passes)
  requireRole('admin'),   // ❌ This might be failing (user role: staff)
  requireOrganization,    // ❌ Or this might be the issue
  getProducts
);`}</pre>
            
            <strong>2. Check user object in products middleware:</strong>
            <pre style={{ fontSize: '0.875rem', margin: '8px 0' }}>{`
// Add logging in your products route:
router.get('/products', (req, res) => {
  console.log('Products route - User:', req.user);
  console.log('Products route - Session:', req.session);
  console.log('Products route - IsAuthenticated:', req.isAuthenticated());
  // ... rest of your route
});`}</pre>
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default ProductsAuthDebugger;