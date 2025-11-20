import React, { useState } from 'react';

export default function SignupForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Check if backend is running
      const healthCheck = await fetch('/health').catch(() => null);
      if (!healthCheck) {
        throw new Error('Backend server is not running. Please start the backend server on port 5000.');
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed');
        return;
      }

      setSuccess(data.message);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

      // Call parent callback after 2 seconds
      setTimeout(() => {
        onSuccess(formData.email);
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Network error. Please check the browser console (F12) for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
          {success}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        value={formData.name}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password (min 6 characters)"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSuccess('login')}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Login
        </button>
      </p>
    </form>
  );
}
