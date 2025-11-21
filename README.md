# Full-Stack Authentication System 🔐

A complete production-ready authentication system built with Node.js, Express, MongoDB, and vanilla JavaScript. Features email-based OTP verification, JWT authentication, and a modern Tailwind CSS interface.

## ✨ Features

- ✅ **User Registration** with email verification
- ✅ **Email OTP Verification** (6-digit code)
- ✅ **Secure Login** with JWT authentication
- ✅ **Password Hashing** using bcrypt
- ✅ **Professional Email Templates** via Nodemailer
- ✅ **Modern UI** with Tailwind CSS
- ✅ **Single Deployment** - Backend serves frontend
- ✅ **Production Ready** - Deploy to Render, Railway, or any Node.js host

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Nodemailer (email delivery)

**Frontend:**
- HTML5
- JavaScript (Vanilla)
- Tailwind CSS (CDN)

## 📁 Project Structure

```
.
├── backend/
│   ├── server.js           # Express server & static file serving
│   ├── controllers/
│   │   └── authController.js  # Signup, login, OTP verification
│   ├── models/
│   │   └── User.js         # Mongoose user schema
│   ├── routes/
│   │   └── authRoutes.js   # API route definitions
│   └── utils/
│       ├── emailService.js # Email sending with templates
│       └── jwtHelper.js    # JWT token utilities
├── frontend/
│   ├── index.html          # Dashboard (protected)
│   ├── login.html          # Login page
│   ├── signup.html         # Registration page
│   └── otp.html            # OTP verification page
├── package.json
└── .env.example            # Environment variables template
```

## 🚀 Quick Start

### 1. Clone or Download

```bash
cd Cannyminds-login
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-system
JWT_SECRET=your-secret-key-min-32-characters-long
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
APP_NAME=Auth System
```

**📧 Gmail Setup:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a password for "Mail"
5. Use that password in `EMAIL_PASS`

### 4. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Use connection string like:
```
mongodb+srv://username:password@cluster.mongodb.net/auth-system
```

### 5. Run the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The app will be available at `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend OTP code |

## 🌐 Deployment

### Deploy to Render

1. **Create New Web Service**
2. **Connect GitHub Repository**
3. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Add Environment Variables:**
   - `MONGO_URI`
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_SERVICE`
   - `APP_NAME`
5. **Deploy!**

### Deploy to Railway

1. **Create New Project**
2. **Deploy from GitHub**
3. **Add Environment Variables** (same as above)
4. **Railway will auto-detect** Node.js and deploy

## 🧪 Testing the Flow

1. **Sign Up** → Go to `/signup`
   - Enter name, email, password
   - Check email for OTP

2. **Verify OTP** → Automatically redirected to `/verify`
   - Enter 6-digit code from email
   - Click "Verify Code"

3. **Login** → Go to `/login`
   - Enter email and password
   - Access dashboard at `/`

4. **Logout** → Click logout button on dashboard

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ OTP expires after 10 minutes
- ✅ Email verification required before login
- ✅ Protected routes with token validation
- ✅ CORS enabled for API security

## 🎨 UI Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive design (mobile-friendly)
- Professional email templates
- Loading states and error handling
- Auto-focus on form inputs

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-system` |
| `JWT_SECRET` | Secret for JWT signing | `my-super-secret-key-32-chars` |
| `EMAIL_SERVICE` | Email provider | `gmail` |
| `EMAIL_USER` | Email address | `noreply@example.com` |
| `EMAIL_PASS` | Email password | `app-specific-password` |
| `APP_NAME` | Application name | `Auth System` |

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running
- Check connection string format
- Verify network access for MongoDB Atlas

**Email Not Sending:**
- Verify Gmail app password is correct
- Check EMAIL_USER and EMAIL_PASS in .env
- Consider using SendGrid for production

**Port Already in Use:**
- Change PORT in .env file
- Kill process using port: `npx kill-port 5000`

## 📄 License

MIT License - Feel free to use this project for learning or production!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Node.js, Express, MongoDB, and Tailwind CSS
