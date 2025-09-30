# Advanced Vercel Deployment Guide

## 🚀 Single Project with Multiple Apps

This guide covers deploying all three apps (Admin Dashboard, Customer Portal, Customer Portal 3002) as a single Vercel project with intelligent routing.

## Configuration Overview

### URL Structure:
- **Root (`/`)**: Admin Dashboard Welcome Page
- **`/admin/*`**: Admin Dashboard routes
- **`/customer/*`**: Customer Portal routes  
- **`/portal/*`**: Customer Portal 3002 routes
- **`/api/*`**: Admin Dashboard API routes

## Step-by-Step Deployment

### 1. Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `preetamspacee/resolved_ackermannn`
4. **Root Directory**: Leave empty (uses root)
5. **Framework Preset**: Other (we're using custom configuration)

### 2. Configure Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: Leave empty (handled by vercel.json)
- **Install Command**: `npm install`

### 3. Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://fcdfwqengcmtsatrkwin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZGZ3cWVuZ2NtdHNhdHJrd2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI1MjAsImV4cCI6MjA3MzI4ODUyMH0.e0VLoxpCLdXzPX0ihTcJiXPmnf3mn9o1Go1hKYvXENE
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
NODE_ENV=production
```

### 4. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Redeploy to apply the updated environment variable

## How It Works

### Build Process:
1. Vercel builds all three Next.js apps simultaneously
2. Each app gets its own `.next` directory
3. Routing is handled by the `vercel.json` configuration

### Routing Logic:
```json
{
  "routes": [
    { "src": "/", "dest": "/apps/admin-dashboard/welcome" },
    { "src": "/admin/(.*)", "dest": "/apps/admin-dashboard/$1" },
    { "src": "/customer/(.*)", "dest": "/apps/customer-portal/$1" },
    { "src": "/portal/(.*)", "dest": "/apps/customer-portal-3002/$1" },
    { "src": "/api/(.*)", "dest": "/apps/admin-dashboard/pages/api/$1" }
  ]
}
```

## Access Your Apps

After deployment, your apps will be available at:

- **Admin Dashboard**: `https://your-project.vercel.app/admin`
- **Customer Portal**: `https://your-project.vercel.app/customer`
- **Customer Portal 3002**: `https://your-project.vercel.app/portal`
- **API Endpoints**: `https://your-project.vercel.app/api/*`

## Troubleshooting

### Common Issues:

1. **Build Fails**: 
   - Check that all environment variables are set
   - Verify the `vercel.json` configuration

2. **Routing Not Working**:
   - Ensure the route patterns match your app structure
   - Check that the destination paths are correct

3. **Environment Variables Not Working**:
   - Make sure they're set in Vercel dashboard
   - Redeploy after adding new variables

4. **Supabase Connection Issues**:
   - Verify the URL and anon key are correct
   - Check that the environment variables are properly set

## Benefits of Advanced Deployment

✅ **Single Project Management**: All apps in one Vercel project
✅ **Shared Environment Variables**: Set once, use everywhere
✅ **Unified Domain**: All apps under one domain with different paths
✅ **Cost Effective**: One project instead of three
✅ **Easy Maintenance**: Single deployment pipeline

## Current Status
✅ Build configuration ready
✅ Routing configured
✅ Environment variables prepared
✅ Ready for deployment

## Next Steps
1. Deploy to Vercel using the configuration above
2. Test all three apps at their respective URLs
3. Update any hardcoded URLs in your code if needed
4. Monitor the deployment for any issues
