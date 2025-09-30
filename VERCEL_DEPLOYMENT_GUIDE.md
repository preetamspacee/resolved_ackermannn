# Vercel Deployment Guide

## Current Status ✅
- All three apps are building successfully locally
- Supabase connection is working
- Environment variables are properly configured

## Deployment Options

### Option 1: Deploy Each App Separately (Recommended)

#### 1. Admin Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Root Directory**: Set to `apps/admin-dashboard`
5. **Framework Preset**: Next.js
6. **Build Command**: `npm run build`
7. **Output Directory**: `.next`
8. **Install Command**: `npm install`

#### 2. Customer Portal
1. Create another project in Vercel
2. Import the same GitHub repository
3. **Root Directory**: Set to `apps/customer-portal`
4. **Framework Preset**: Next.js
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`
7. **Install Command**: `npm install`

#### 3. Customer Portal 3002
1. Create another project in Vercel
2. Import the same GitHub repository
3. **Root Directory**: Set to `apps/customer-portal-3002`
4. **Framework Preset**: Next.js
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`
7. **Install Command**: `npm install`

### Environment Variables for Each App

Set these in Vercel dashboard for each project:

```
NEXT_PUBLIC_SUPABASE_URL=https://fcdfwqengcmtsatrkwin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZGZ3cWVuZ2NtdHNhdHJrd2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI1MjAsImV4cCI6MjA3MzI4ODUyMH0.e0VLoxpCLdXzPX0ihTcJiXPmnf3mn9o1Go1hKYvXENE
NEXT_PUBLIC_APP_URL=[your-vercel-url]
NODE_ENV=production
```

### Option 2: Single Vercel Project (Advanced)

If you want all apps in one Vercel project, update the root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/admin-dashboard/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    },
    {
      "src": "apps/customer-portal/package.json", 
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    },
    {
      "src": "apps/customer-portal-3002/package.json",
      "use": "@vercel/next", 
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/apps/admin-dashboard/$1"
    },
    {
      "src": "/customer/(.*)",
      "dest": "/apps/customer-portal/$1"
    },
    {
      "src": "/portal/(.*)",
      "dest": "/apps/customer-portal-3002/$1"
    },
    {
      "src": "/",
      "dest": "/apps/admin-dashboard/welcome"
    }
  ]
}
```

## Common Vercel Deployment Issues

### 1. Build Errors
- Ensure each app has its own `vercel.json`
- Check that build commands are correct
- Verify all dependencies are in `package.json`

### 2. Environment Variables
- Set all required env vars in Vercel dashboard
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Restart deployment after adding env vars

### 3. Monorepo Issues
- Use separate Vercel projects for each app
- Set correct root directory for each project
- Ensure each app has its own `package.json`

## URLs After Deployment
- Admin Dashboard: `https://your-admin-project.vercel.app`
- Customer Portal: `https://your-customer-project.vercel.app`
- Customer Portal 3002: `https://your-portal3002-project.vercel.app`

## Troubleshooting
1. Check Vercel build logs for specific errors
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that Supabase connection is working
