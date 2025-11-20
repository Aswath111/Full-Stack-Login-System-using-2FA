#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const frontendBuildPath = path.join(__dirname, '..', '..', 'frontend', 'build');
const backendBuildPath = path.join(__dirname, '..', 'build');

console.log('🔄 Checking for React build...');
console.log(`Frontend build path: ${frontendBuildPath}`);
console.log(`Backend build path: ${backendBuildPath}`);

// Check if frontend build exists
if (!fs.existsSync(frontendBuildPath)) {
  console.warn('⚠️  Frontend build not found. This is expected during initial setup.');
  console.warn('   Run "npm run build" in the frontend folder first.');
  process.exit(0);
}

console.log('✓ Frontend build found');

// Remove old backend build if it exists
if (fs.existsSync(backendBuildPath)) {
  console.log('🗑️  Removing old backend build...');
  try {
    fs.rmSync(backendBuildPath, { recursive: true, force: true });
    console.log('✓ Old build removed');
  } catch (error) {
    console.error('❌ Error removing old build:', error.message);
    process.exit(1);
  }
}

// Copy frontend build to backend
console.log('📋 Copying frontend build to backend...');
try {
  copyDirSync(frontendBuildPath, backendBuildPath);
  console.log('✅ Build copied successfully!');
  console.log(`   Location: ${backendBuildPath}`);
} catch (error) {
  console.error('❌ Error copying build:', error.message);
  process.exit(1);
}

// Helper function to recursively copy directories
function copyDirSync(src, dest) {
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
}
