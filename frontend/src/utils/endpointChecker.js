// src/utils/
import api from '../services/api'; // Adjust path as needed


export const checkBackendEndpoints = async () => {
  const endpoints = [
    // Product endpoints
    { path: '/products', name: 'Products' },
    { path: '/inventory', name: 'Inventory' },
    { path: '/items', name: 'Items' },
    { path: '/product', name: 'Product (singular)' },
    
    // Dashboard endpoints
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/dashboard/stats', name: 'Dashboard Stats' },
    { path: '/analytics', name: 'Analytics' },
    { path: '/stats', name: 'Stats' },
    { path: '/summary', name: 'Summary' },
    
    // Activity endpoints
    { path: '/activity', name: 'Activity' },
    { path: '/logs', name: 'Logs' },
    { path: '/audit', name: 'Audit' },
    { path: '/history', name: 'History' },
  ];

  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint.path);
      results[endpoint.path] = {
        status: 'success',
        statusCode: response.status,
        dataType: typeof response.data,
        hasData: !!response.data,
        dataKeys: typeof response.data === 'object' ? Object.keys(response.data) : [],
        sampleData: JSON.stringify(response.data).substring(0, 200) + '...'
      };
    } catch (error) {
      results[endpoint.path] = {
        status: 'error',
        statusCode: error.response?.status || 'network_error',
        error: error.response?.data?.message || error.message
      };
    }
  }
  
  return results;
};

// Check what endpoints actually work
export const findWorkingEndpoints = async () => {
  console.log('🔍 Checking backend endpoints...');
  const results = await checkBackendEndpoints();
  
  const working = [];
  const notFound = [];
  const unauthorized = [];
  const errors = [];
  
  Object.entries(results).forEach(([path, result]) => {
    if (result.status === 'success') {
      working.push({ path, ...result });
    } else if (result.statusCode === 404) {
      notFound.push({ path, ...result });
    } else if (result.statusCode === 401) {
      unauthorized.push({ path, ...result });
    } else {
      errors.push({ path, ...result });
    }
  });
  
  console.log('✅ Working endpoints:', working);
  console.log('❌ 404 Not Found:', notFound);
  console.log('🔒 401 Unauthorized:', unauthorized);
  console.log('💥 Other errors:', errors);
  
  return { working, notFound, unauthorized, errors };
};