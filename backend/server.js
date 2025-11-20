require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const { initAuditFile } = require('./utils/auditUtils');
const { initializeFirebase } = require('./utils/firebaseUtils');
const { initializeEmailService } = require('./utils/emailUtils');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase (optional, with fallback)
initializeFirebase();

// Initialize Email Service
initializeEmailService();

// Middleware
// CORS - only for development or if frontend is on different domain
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
} else {
  // In production, frontend is served from same origin, so CORS not needed
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize audit file
initAuditFile();

// API Routes - MUST be before static files and SPA fallback
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Serve static files and SPA fallback - only if build folder exists (production)
const buildPath = path.join(__dirname, '../frontend/build');
const fs = require('fs');
if (fs.existsSync(buildPath)) {
  // Production: serve React build
  app.use(express.static(buildPath));
  
  // SPA fallback for production
  app.use((req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Secure Login System                       ║
║  Server running on port ${PORT}              ║
║  http://localhost:${PORT}                      ║
║                                            ║
║  Test Credentials:                         ║
║  Email: user@example.com                   ║
║  Password: password123                     ║
║                                            ║
║  Endpoints:                                ║
║  POST /api/auth/signup                     ║
║  POST /api/auth/login                      ║
║  POST /api/auth/verify-otp                 ║
║  POST /api/auth/resend-otp                 ║
║  GET  /health                              ║
║                                            ║
║  OTP Delivery:                             ║
║  ✓ Email (if SMTP configured)              ║
║  ✓ Console (fallback)                      ║
╚════════════════════════════════════════════╝
  `);
});

