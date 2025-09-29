# Vercel Deployment Guide for Crypto Ackermann

## Configuration Overview

The project has been configured for Vercel deployment with the following setup:

### 🎯 **Default Redirect Configuration**
- **Default URL (port 3000)**: `http://localhost:3000` → **Redirects to** → `http://localhost:3001/welcome`
- **Admin Dashboard**: Available at `/admin/*` routes
- **Customer Portal**: Available at `/customer/*` routes

### 📁 **Key Configuration Files Created:**

1. **`vercel.json`** - Main Vercel configuration
2. **`pages/index.tsx`** - Root redirect page (port 3000 → admin welcome)
36:39:vercel.json
3. **`.vercelignore`** - Files to exclude from deployment
4. **`package-vercel.json`** - Vercel-specific package configuration

### 🚀 **Deployment Steps:**

#### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd "/Users/preetamkumar/Desktop/new cryptonix/CRYPTO-ACKERMANN"
vercel

# For production deployment
vercel --prod
```

#### Method 2: Git Integration
1. Push your code to GitHub/GitLab
2. Connect your repository to Vercel
3. Vercel will automatically deploy from the `main` branch

### 🔗 **URL Structure After Deployment:**

- **Root Domain**: `https://your-app.vercel.app/` → Redirects to Admin Welcome Page
- **Admin Routes**: `https://your-app.vercel.app/admin/*`
- **Customer Routes**: `https://your-app.vercel.app/customer/*`
- **API Routes**: `https://your-app.vercel.app/api/*`

### ⚙️ **Environment Variables:**

Set the following in your Vercel dashboard:
- `NODE_ENV=production`
- Any Supabase/API keys your app needs

### 🔧 **Build Configuration:**
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 📝 **Notes:**
- The admin dashboard is configured for static export
- Customer portal remains dynamic
- Root page automatically redirects to admin welcome
- All routes are properly configured in `vercel.json`

### 🚨 **Troubleshooting:**

If deployment fails:
1. Check that all dependencies are in `package.json`
2. Ensure `next.config.js` files are properly configured
3. Verify environment variables are set in Vercel dashboard
4. Check build logs in Vercel dashboard for specific errors
