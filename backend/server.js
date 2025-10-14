require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const connectDB = require('./config/database');
const cronJobs = require('./jobs/cronJobs');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ensure upload folder exists
const uploadFolder = process.env.UPLOAD_FOLDER || './uploads';
fs.ensureDirSync(uploadFolder);

// Routes
const apiRoutes = require('./routes/api');
const syncRoutes = require('./routes/sync');

app.use('/api', apiRoutes);
app.use('/api/sync', syncRoutes);

// OAuth callback route (for Gmail authentication)
app.get('/oauth2callback', (req, res) => {
  const { code } = req.query;
  if (code) {
    res.send(`
      <html>
        <head><title>Gmail Authentication</title></head>
        <body>
          <h2>Authorization Code Received</h2>
          <p>Copy this code and use it in the settings page:</p>
          <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${code}</pre>
          <p>Or make a GET request to: <code>/api/sync/oauth-callback?code=${code}</code></p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
  } else {
    res.status(400).send('No authorization code received');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Email Dumper API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      customers: '/api/customers',
      customerById: '/api/customers/:proposalNo',
      upload: '/api/upload',
      dashboardStats: '/api/dashboard/stats',
      export: '/api/export',
      syncHistory: '/api/sync/history',
      triggerSync: '/api/sync/refresh',
      gmailAuth: '/api/sync/auth-url'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n===========================================`);
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API: http://localhost:${PORT}`);
      console.log(`===========================================\n`);
    });

    // Start cron jobs
    if (process.env.NODE_ENV !== 'test') {
      cronJobs.start();
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
