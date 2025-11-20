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

// Ensure build folder exists before starting the app
const ensureBuildFolder = () => {
  const buildPath = path.join(__dirname, 'build');
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  
  if (!fs.existsSync(buildPath) && fs.existsSync(frontendBuildPath)) {
    console.log('🔄 Build folder missing. Copying from frontend...');
    try {
      // Recursive copy function
      const copyDirSync = (src, dest) => {
        fs.mkdirSync(dest, { recursive: true });
        const files = fs.readdirSync(src);
        files.forEach(file => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          const stat = fs.statSync(srcPath);
          if (stat.isDirectory()) {
            copyDirSync(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        });
      };
      
      copyDirSync(frontendBuildPath, buildPath);
      console.log('✅ Build folder copied successfully on startup');
    } catch (error) {
      console.error('❌ Failed to copy build folder:', error.message);
    }
  }
};

// Run before initializing Firebase
ensureBuildFolder();

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

console.log(`Build path: ${buildPath}`);
console.log(`Build exists: ${buildExists}`);

if (buildExists) {
  console.log('✓ Serving React build from backend/build');
  app.use(express.static(buildPath));

  // SPA fallback: Serve index.html for all non-API routes
  app.use((req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`index.html not found at ${indexPath}`);
      res.status(404).json({ error: 'index.html not found' });
    }
  });
} else {
  // If no build folder, create a simple fallback
  console.warn('⚠ Frontend build not found. Serving health check only.');
  app.use((req, res) => {
    if (req.path === '/') {
      res.status(503).json({ 
        error: 'Frontend build not found',
        message: 'Build process may still be running. Try again in a moment.',
        status: 'building'
      });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
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

const server = app.listen(PORT, () => {
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

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

