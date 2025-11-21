# Deployment Guide - Single Link Deploy

## ✅ Your App is Ready!

The system is **already configured** for single-link deployment - the backend serves the frontend.

## 🚀 Deploy to Render (Free & Easy)

### Step 1: Prepare Your Code

First, make sure your code is in a GitHub repository:

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Ready for deployment"
```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code

### Step 2: Deploy on Render

1. **Go to**: https://render.com (sign up free)

2. **Click**: "New" → "Web Service"

3. **Connect** your GitHub repository

4. **Configure**:
   - **Name**: `auth-system` (or any name you like)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Get from MongoDB Atlas (see below) |
| `JWT_SECRET` | `super-secret-jwt-key-minimum-32-characters-long` |
| `EMAIL_SERVICE` | `gmail` |
| `EMAIL_USER` | `subramaniaswathkumar@gmail.com` |
| `EMAIL_PASS` | `kwou dpzc qznt yset` |
| `APP_NAME` | `Auth System` |
| `NODE_ENV` | `production` |

### Step 4: Setup MongoDB Atlas (Cloud Database)

You **cannot use localhost MongoDB** for deployment. You need MongoDB Atlas:

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Create** a free M0 cluster (takes 3-5 minutes)
3. **Database Access**: Create a user with password
4. **Network Access**: Add IP `0.0.0.0/0` (allow all)
5. **Connect**: Get connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/auth-system
   ```
6. **Use this** in `MONGO_URI` on Render

### Step 5: Deploy!

Click **"Create Web Service"** and wait ~5 minutes.

You'll get a URL like: `https://auth-system-xxxx.onrender.com`

---

## 🎯 Your Single Link

After deployment, **ONE URL** serves everything:
- 🏠 Dashboard: `https://your-app.onrender.com/`
- 📝 Signup: `https://your-app.onrender.com/signup`
- 🔐 Login: `https://your-app.onrender.com/login`
- 🔌 API: `https://your-app.onrender.com/api/auth/*`

---

## Alternative: Railway

**Deploy to Railway** (even easier):

1. Go to: https://railway.app
2. Click "Deploy from GitHub"
3. Select your repository
4. Add the same environment variables
5. Railway auto-deploys!

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Gmail app password ready
- [ ] Environment variables prepared
- [ ] Render/Railway account created

**Ready to deploy?** Follow the steps above!
