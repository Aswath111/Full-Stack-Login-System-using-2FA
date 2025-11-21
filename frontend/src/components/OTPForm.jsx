import React, { useState } from 'react';

export default function OTPForm({ sessionId, email, onVerify, onResend }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = process.env.REACT_APP_API_URL;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');

      onVerify && onVerify(sessionId, otp, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to resend OTP');

      setOtp('');
      alert('OTP resent successfully!');
      onResend && onResend();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="max-w-md mx-auto mt-10 space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
      <p className="text-center text-gray-600 text-sm">Enter the OTP sent to <strong>{email}</strong></p>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        maxLength="6"
        className="w-full px-4 py-2 border rounded text-center text-2xl tracking-widest"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={loading}
        className="w-full text-blue-600 py-2 rounded hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Resending...' : 'Resend OTP'}
      </button>
    </form>
  );
}
