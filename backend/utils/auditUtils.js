const fs = require('fs');
const path = require('path');

const AUDIT_FILE = path.join(__dirname, '../login-audit.json');

const initAuditFile = () => {
  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2));
  }
};

const logLoginAttempt = (email, success, reason = '') => {
  initAuditFile();
  const logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
  
  logs.push({
    timestamp: new Date().toISOString(),
    email,
    success,
    reason,
    ipAddress: '',
    type: reason.includes('registered') ? 'SIGNUP' : reason.includes('OTP') ? 'OTP_VERIFY' : 'LOGIN',
  });

  // Keep only last 1000 entries to prevent file from growing too large
  if (logs.length > 1000) {
    logs.shift();
  }

  fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2));
};

const getLoginLogs = (email = null) => {
  initAuditFile();
  const logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
  
  if (email) {
    return logs.filter(log => log.email === email);
  }
  
  return logs;
};

const getLoginStats = () => {
  const logs = getLoginLogs();
  
  return {
    totalAttempts: logs.length,
    successfulLogins: logs.filter(l => l.success && l.type === 'LOGIN').length,
    failedLogins: logs.filter(l => !l.success && l.type === 'LOGIN').length,
    signups: logs.filter(l => l.type === 'SIGNUP').length,
    otpVerifications: logs.filter(l => l.type === 'OTP_VERIFY').length,
    successRate: logs.length > 0 ? ((logs.filter(l => l.success).length / logs.length) * 100).toFixed(2) + '%' : '0%',
  };
};

module.exports = {
  logLoginAttempt,
  getLoginLogs,
  getLoginStats,
  initAuditFile,
};
