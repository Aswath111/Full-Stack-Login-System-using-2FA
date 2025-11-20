const { findUserByEmail, verifyPassword } = require('../models/User');
const { logLoginAttempt } = require('../utils/auditUtils');
const { generateOTP, sendOTP, storeOTP, generateSessionId } = require('../utils/otpUtils');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      logLoginAttempt(email || 'unknown', false, 'Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      logLoginAttempt(email, false, 'User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      logLoginAttempt(email, false, 'Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate OTP and session
    const otp = generateOTP(6);
    const sessionId = generateSessionId();
    
    // Store OTP in memory
    storeOTP(sessionId, email, otp);

    // Send OTP (log to console for demo)
    await sendOTP(email, otp);

    logLoginAttempt(email, true, 'OTP generated and sent');

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.',
      sessionId,
      email,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  login,
};
