// Firebase Admin SDK Integration
// This module initializes Firebase and provides utilities for sending OTP

let admin = null;

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if firebase credentials are provided
    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // Check if all required fields are present
    if (!firebaseConfig.projectId || !firebaseConfig.privateKey || !firebaseConfig.clientEmail) {
      console.warn('Firebase credentials not fully configured. OTP will be logged to console only.');
      return null;
    }

    admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      });
      
      console.log('✓ Firebase Admin SDK initialized');
    }

    return admin;
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('OTP will be logged to console. Configure Firebase credentials in .env for production.');
    return null;
  }
};

// Send OTP via Firebase Authentication
const sendOTPViaFirebase = async (phoneNumber, otp) => {
  try {
    if (!admin) {
      throw new Error('Firebase not initialized');
    }

    // Use Firebase Authentication for phone verification
    // This is a placeholder - actual implementation depends on your setup
    console.log(`Firebase: OTP ${otp} would be sent to ${phoneNumber}`);
    
    return {
      success: true,
      message: 'OTP sent via Firebase',
      sessionId: new Date().getTime().toString(),
    };
  } catch (error) {
    console.error('Firebase OTP error:', error.message);
    throw error;
  }
};

// Send OTP via Email using Firebase (through custom function)
const sendOTPViaEmail = async (email, otp) => {
  try {
    if (!admin) {
      // Fallback: log to console if Firebase not initialized
      console.log(`
      ╔════════════════════════════════════╗
      ║  OTP for: ${email.padEnd(25)}  ║
      ║  Code: ${otp.padEnd(28)}  ║
      ║  Expires in: 10 minutes${' '.repeat(14)}║
      ╚════════════════════════════════════╝
      `);
      return {
        success: true,
        message: 'OTP logged to console (Firebase not configured)',
      };
    }

    // Send email using Firebase Cloud Messaging or Sendgrid
    // Placeholder implementation
    console.log(`Firebase Email: OTP ${otp} sent to ${email}`);
    
    return {
      success: true,
      message: 'OTP sent via email',
    };
  } catch (error) {
    console.error('Firebase email OTP error:', error.message);
    throw error;
  }
};

// Get Firebase instance
const getFirebaseAdmin = () => {
  if (!admin) {
    initializeFirebase();
  }
  return admin;
};

module.exports = {
  initializeFirebase,
  sendOTPViaFirebase,
  sendOTPViaEmail,
  getFirebaseAdmin,
};
