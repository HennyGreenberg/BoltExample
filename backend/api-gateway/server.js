const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'api-gateway'
  });
});

// Service routes with proxy
const services = {
  auth: {
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:8001',
    prefix: '/api/auth'
  },
  users: {
    target: process.env.USER_SERVICE_URL || 'http://user-service:8002',
    prefix: '/api/users'
  },
  students: {
    target: process.env.STUDENT_SERVICE_URL || 'http://student-service:8003',
    prefix: '/api/students'
  },
  reports: {
    target: process.env.REPORT_SERVICE_URL || 'http://report-service:8004',
    prefix: '/api/reports'
  },
  assessmentForms: {
    target: process.env.ASSESSMENT_FORM_SERVICE_URL || 'http://assessment-form-service:8005',
    prefix: '/api/assessment-forms'
  }
};

// Create proxy middleware for each service
Object.entries(services).forEach(([name, config]) => {
  app.use(config.prefix, createProxyMiddleware({
    target: config.target,
    changeOrigin: true,
    pathRewrite: {
      [`^${config.prefix}`]: ''
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${name} service:`, err);
      res.status(503).json({
        error: 'Service temporarily unavailable',
        service: name
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log proxy requests
      console.log(`Proxying ${req.method} ${req.path} to ${name} service`);
    }
  }));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Service endpoints:');
  Object.entries(services).forEach(([name, config]) => {
    console.log(`  ${name}: ${config.prefix} -> ${config.target}`);
  });
});

module.exports = app;