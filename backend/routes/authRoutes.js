const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { verifyOtpCode, resendOtp } = require('../controllers/otpController');
const { signup } = require('../controllers/signupController');
const { loginLimiter, otpLimiter } = require('../middleware/auth');

// Public routes
router.post('/signup', loginLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/verify-otp', otpLimiter, verifyOtpCode);
router.post('/resend-otp', otpLimiter, resendOtp);

module.exports = router;
