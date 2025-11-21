# 🚀 Quick Deployment Guide

## Local Testing

### 1. Setup Environment
Copy `.env.example` to `backend/.env` and configure:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-system
JWT_SECRET=your-random-secret-key-minimum-32-characters-long
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
APP_NAME=Auth System
```

### 2. Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** → **Other** → Generate
5. Copy password to `.env` file

### 3. Start Server
```bash
npm start
```

Visit: **http://localhost:5000**

---

## Deploy to Render (Recommended)

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Create Web Service
1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `auth-system`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 3: Environment Variables
Add these in Render dashboard:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Random 32+ character string |
| `EMAIL_SERVICE` | `gmail` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail app password |
| `APP_NAME` | `Auth System` |
| `NODE_ENV` | `production` |

### Step 4: Deploy
Click **Create Web Service** → Wait for deployment

Your app will be live at: `https://auth-system-xxxx.onrender.com`

---

## Deploy to Railway

### Step 1: Create Project
1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository

### Step 2: Add Environment Variables
In Railway dashboard, add the same variables as Render

### Step 3: Deploy
Railway auto-detects Node.js and deploys automatically!

---

## MongoDB Atlas Setup

### For Cloud Deployment:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (for Render/Railway)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/auth-system
   ```
6. Use this in `MONGO_URI` environment variable

---

## Testing After Deployment

1. **Signup**: `https://your-url.com/signup`
2. **Check Email**: Verify OTP arrives
3. **Login**: `https://your-url.com/login`
4. **Dashboard**: `https://your-url.com/`

---

## Troubleshooting

**MongoDB Connection Error:**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas whitelist includes `0.0.0.0/0`
- Ensure user has read/write permissions

**Email Not Sending:**
- Verify Gmail app password (not regular password)
- Check `EMAIL_USER` and `EMAIL_PASS` are set
- Try SendGrid for production: `EMAIL_SERVICE=SendGrid`

**Build Failure:**
- Check Node version (need ≥18.0.0)
- Run `npm install` locally first
- Check all files committed to Git

---

## Production Tips

✅ Use **MongoDB Atlas** (not local MongoDB)  
✅ Use **SendGrid** or **AWS SES** for emails (better than Gmail)  
✅ Generate strong `JWT_SECRET` with: `openssl rand -base64 32`  
✅ Enable HTTPS (automatic on Render/Railway)  
✅ Monitor logs for errors  
✅ Set up error alerting  

---

**Ready to deploy!** 🎉
