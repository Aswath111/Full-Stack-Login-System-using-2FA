const { createUser } = require('../models/User');
const { logLoginAttempt } = require('../utils/auditUtils');

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    // Create user
    const newUser = await createUser(email, password, name);

    logLoginAttempt(email, true, 'User registered');

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please login to verify your email.',
      user: newUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check if error is due to existing user
    if (error.message === 'Email already registered') {
      logLoginAttempt(req.body.email || 'unknown', false, 'Email already exists');
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login instead.',
      });
    }

    // Check for validation errors
    if (error.message.includes('Invalid email') || error.message.includes('Password must')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    logLoginAttempt(req.body.email || 'unknown', false, 'Signup error');

    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
    });
  }
};

module.exports = {
  signup,
};
