const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP email
const sendOtpEmail = async (email, otp, name) => {
    const mailOptions = {
        from: `"${process.env.APP_NAME || 'Auth System'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .content h2 {
            color: #333;
            margin-bottom: 20px;
          }
          .otp-box {
            background: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            display: inline-block;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .message {
            color: #666;
            line-height: 1.6;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          .warning {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Verification Code</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p class="message">
              Thank you for signing up! Please use the following code to verify your email address:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="message">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <p class="warning">
              ⚠️ If you didn't request this code, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'Auth System'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOtpEmail
};
