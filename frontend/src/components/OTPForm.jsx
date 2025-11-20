import React, { useState } from 'react';

export default function OTPForm({ sessionId, email, onVerify, onResend }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onVerify(sessionId, otp);
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);

    try {
      await onResend(sessionId, email);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-4 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
      <p className="text-center text-gray-600 text-sm">
        Enter the OTP sent to <strong>{email}</strong>
      </p>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

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
