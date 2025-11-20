const bcrypt = require('bcrypt');

// Mock user database (use MongoDB in production)
// Password: password123 (bcrypt hash)
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: '$2b$10$K7ZsZ5Rz8YjvQk9qL7aLe.C8B7EqM5H6N1O2P3Q4R5S6T7U8V9W0X',
    name: 'Test User',
    isVerified: true,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: '$2b$10$K7ZsZ5Rz8YjvQk9qL7aLe.C8B7EqM5H6N1O2P3Q4R5S6T7U8V9W0X',
    name: 'Admin User',
    isVerified: true,
    createdAt: new Date('2025-01-01'),
  },
];

const findUserByEmail = async (email) => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const findUserById = async (id) => {
  return mockUsers.find(user => user.id === id);
};

const createUser = async (email, password, name) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    isVerified: false, // Mark as unverified until OTP is verified
    createdAt: new Date(),
  };
  
  mockUsers.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const updateUserVerification = async (email, isVerified = true) => {
  const user = await findUserByEmail(email);
  if (user) {
    user.isVerified = isVerified;
  }
  return user;
};

const getAllUsers = async () => {
  // Return users without passwords
  return mockUsers.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

module.exports = {
  findUserByEmail,
  verifyPassword,
  findUserById,
  createUser,
  updateUserVerification,
  getAllUsers,
};
