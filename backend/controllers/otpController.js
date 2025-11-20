const { verifyOTP } = require('../utils/otpUtils');
const { generateToken } = require('../utils/jwtUtils');
const { findUserByEmail, updateUserVerification } = require('../models/User');
const { logLoginAttempt } = require('../utils/auditUtils');

const verifyOtpCode = async (req, res) => {
  try {
    const { sessionId, otp } = req.body;

    // Validate input
    if (!sessionId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and OTP are required',
      });
    }

    // Verify OTP
    const otpVerification = verifyOTP(sessionId, otp);
    
    if (!otpVerification.valid) {
      return res.status(401).json({
        success: false,
        message: otpVerification.reason,
      });
    }

    const { email } = otpVerification;

    // Get user details
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Mark user as verified
    await updateUserVerification(email, true);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    logLoginAttempt(email, true, 'OTP verified - Login successful');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { sessionId, email } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and email are required',
      });
    }

    // Verify user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // In a real app, validate that sessionId matches email
    const { generateOTP, sendOTP, storeOTP } = require('../utils/otpUtils');
    
    const otp = generateOTP(6);
    storeOTP(sessionId, email, otp);
    await sendOTP(email, otp);

    logLoginAttempt(email, true, 'OTP resent');

    res.status(200).json({
      success: true,
      message: 'OTP resent to your email',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  verifyOtpCode,
  resendOtp,
};
