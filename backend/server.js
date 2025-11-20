require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const { initAuditFile } = require('./utils/auditUtils');
const { initializeFirebase } = require('./utils/firebaseUtils');
const { initializeEmailService } = require('./utils/emailUtils');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase
initializeFirebase();

// Initialize Email Service
initializeEmailService();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
} else {
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize audit file
initAuditFile();

// API Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Serve React build (production)
const buildPath = path.join(__dirname, 'build');
const buildExists = fs.existsSync(buildPath);

if (buildExists) {
  app.use(express.static(buildPath));

  // SPA fallback: Serve index.html for all non-API routes
  app.use((req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'index.html not found' });
    }
  });
} else {
  // If no build folder, show helpful error
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Frontend build not found',
      message: 'Please run: npm run build',
      buildPath: buildPath
    });
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

