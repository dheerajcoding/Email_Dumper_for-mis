import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const customerAPI = {
  // Get all customers with optional pagination and search
  getAllCustomers: (page = 1, limit = 50, filters = {}) => 
    api.get('/customers', { 
      params: { 
        page, 
        limit,
        ...filters
      } 
    }),

  // Get customer by proposal number
  getCustomer: (proposalNumber) => api.get(`/customers/${proposalNumber}`),

  // Upload Excel file
  uploadExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get dashboard stats
  getDashboardStats: () => api.get('/dashboard/stats'),

  // Export customers
  exportCustomers: () => api.get('/export', { responseType: 'blob' }),

  // Get sync history
  getSyncHistory: (limit = 20) => api.get('/sync/history', { params: { limit } }),
};

export const syncAPI = {
  // Trigger manual sync
  triggerSync: () => api.post('/sync/refresh'),

  // Get Gmail auth URL
  getAuthUrl: () => api.get('/sync/auth-url'),

  // OAuth callback
  handleCallback: (code) => api.get('/sync/oauth-callback', { params: { code } }),
};

export default api;
