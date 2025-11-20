// Email service for sending OTP
const nodemailer = require('nodemailer');

let transporter = null;

// Initialize email transporter
const initializeEmailService = () => {
  try {
    // Check if SMTP credentials are provided
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpHost && smtpPort && smtpUser && smtpPassword) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpPort == 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      console.log('✓ Email service initialized with SMTP');
      return transporter;
    } else {
      console.log('⚠ SMTP credentials not configured. OTP will be shown in backend console.');
      return null;
    }
  } catch (error) {
    console.error('Email service initialization failed:', error.message);
    console.log('⚠ OTP will be shown in backend console only.');
    return null;
  }
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  try {
    // If transporter is configured, send real email
    if (transporter) {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP Code - Cannyminds Login',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
            <p style="color: #666; font-size: 16px;">
              Hello,<br><br>
              Use the following One-Time Password (OTP) to complete your login:
            </p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: #007bff; letter-spacing: 2px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              <strong>⏱ This OTP expires in 10 minutes.</strong><br>
              If you did not request this code, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
              This is an automated message from Cannyminds Login System.<br>
              Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✓ OTP email sent to ${email}`);
      return {
        success: true,
        message: 'OTP sent to your email',
        method: 'email',
      };
    } else {
      // Fallback: log to console
      console.log(`
  ╔════════════════════════════════════╗
  ║  OTP for: ${email.padEnd(25)}  ║
  ║  Code: ${otp.padEnd(28)}  ║
  ║  Expires in: 10 minutes${' '.repeat(14)}║
  ╚════════════════════════════════════╝
      `);
      return {
        success: true,
        message: 'OTP shown in console (email not configured)',
        method: 'console',
      };
    }
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    // Fallback to console on error
    console.log(`
  ╔════════════════════════════════════╗
  ║  OTP for: ${email.padEnd(25)}  ║
  ║  Code: ${otp.padEnd(28)}  ║
  ║  Expires in: 10 minutes${' '.repeat(14)}║
  ╚════════════════════════════════════╝
    `);
    return {
      success: true,
      message: 'OTP shown in console (email error - check logs)',
      method: 'console',
    };
  }
};

module.exports = {
  initializeEmailService,
  sendOTPEmail,
};
