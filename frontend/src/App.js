import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import OTPForm from './components/OTPForm';
import SignupForm from './components/SignupForm';

// Use backend URL from .env
const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, signup, login, otp, success
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = (action) => {
    if (action === 'login') {
      setCurrentStep('login');
    } else {
      setCurrentStep('login');
      setSuccessMessage('Account created! Please log in to verify your email.');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const handleLogin = async ({ email, password }) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      setSessionData({ sessionId: data.sessionId, email: data.email });
      setCurrentStep('otp');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleOTPVerify = async (sessionId, otp) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccessMessage(`Welcome, ${data.user.name}!`);
      setTimeout(() => {
        setCurrentStep('success');
        setTimeout(() => {
          window.location.href = 'https://www.cannymindstech.com/';
        }, 3000);
      }, 500);
    } catch (err) {
      console.error('OTP verification error:', err);
      throw err;
    }
  };

  const handleResendOTP = async (sessionId, email) => {
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to resend OTP');

      setSuccessMessage('OTP resent successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Resend OTP error:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentStep('welcome');
    setSessionData(null);
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentStep === 'welcome' && (
          <div className="max-w-md mx-auto mt-10 space-y-4 p-6 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h1>
            <p className="text-gray-600 mb-6">
              Secure two-factor authentication system with OTP verification
            </p>
            <button
              onClick={() => setCurrentStep('login')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold mb-3"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentStep('signup')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
            >
              Create Account
            </button>
          </div>
        )}

        {currentStep === 'signup' && (
          <SignupForm onSuccess={handleSignup} />
        )}

        {currentStep === 'login' && (
          <>
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
            <LoginForm onSubmit={handleLogin} />
            <button
              onClick={() => setCurrentStep('welcome')}
              className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Back to Welcome
            </button>
          </>
        )}

        {currentStep === 'otp' && sessionData && (
          <>
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
            <OTPForm
              sessionId={sessionData.sessionId}
              email={sessionData.email}
              onVerify={handleOTPVerify}
              onResend={handleResendOTP}
            />
          </>
        )}

        {currentStep === 'success' && (
          <div className="max-w-md mx-auto mt-10 space-y-4 p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Login Successful!</h2>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <p className="text-sm text-gray-500 mb-4">Redirecting to Cannyminds website in 3 seconds...</p>
            <button
              onClick={() => window.location.href = 'https://www.cannymindstech.com/'}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
            >
              Go to Cannyminds
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
