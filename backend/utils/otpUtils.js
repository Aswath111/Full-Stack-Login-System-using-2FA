const crypto = require('crypto');
const { sendOTPEmail } = require('./emailUtils');

// In-memory OTP store (use Redis in production)
const otpStore = {};

const generateOTP = (length = 6) => {
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
};

const sendOTP = async (email, otp) => {
  try {
    // Send OTP via email service
    const result = await sendOTPEmail(email, otp);
    return result.success;
  } catch (error) {
    console.error('Error in sendOTP:', error.message);
    return false;
  }
};

const storeOTP = (sessionId, email, otp) => {
  otpStore[sessionId] = {
    email,
    otp,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };
};

const verifyOTP = (sessionId, otp) => {
  const otpData = otpStore[sessionId];
  
  if (!otpData) {
    return { valid: false, reason: 'Session not found' };
  }

  if (Date.now() > otpData.expiresAt) {
    delete otpStore[sessionId];
    return { valid: false, reason: 'OTP expired' };
  }

  if (otpData.attempts >= 5) {
    delete otpStore[sessionId];
    return { valid: false, reason: 'Too many attempts' };
  }

  if (otpData.otp !== otp) {
    otpData.attempts++;
    return { valid: false, reason: 'Invalid OTP' };
  }

  const email = otpData.email;
  delete otpStore[sessionId];
  
  return { valid: true, email };
};

const generateSessionId = () => {
  return crypto.randomUUID();
};

module.exports = {
  generateOTP,
  sendOTP,
  storeOTP,
  verifyOTP,
  generateSessionId,
};
