# Vercel Environment Variables Setup

## ✅ Build Fixed!
The build now works correctly with fallback values for missing environment variables.

## Environment Variables to Set in Vercel

### For Each App (Admin Dashboard, Customer Portal, Customer Portal 3002):

1. **Go to your Vercel project dashboard**
2. **Click on "Settings" tab**
3. **Click on "Environment Variables"**
4. **Add these variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://fcdfwqengcmtsatrkwin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZGZ3cWVuZ2NtdHNhdHJrd2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTI1MjAsImV4cCI6MjA3MzI4ODUyMH0.e0VLoxpCLdXzPX0ihTcJiXPmnf3mn9o1Go1hKYvXENE
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### Environment Variable Details:

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key (public key)
- **NEXT_PUBLIC_APP_URL**: Your Vercel app URL (update after deployment)
- **NODE_ENV**: Set to "production" for Vercel

## Deployment Steps:

### Option 1: Deploy Each App Separately (Recommended)

1. **Admin Dashboard:**
   - Create new Vercel project
   - Root Directory: `apps/admin-dashboard`
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Customer Portal:**
   - Create new Vercel project
   - Root Directory: `apps/customer-portal`
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Customer Portal 3002:**
   - Create new Vercel project
   - Root Directory: `apps/customer-portal-3002`
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Option 2: Single Project (Advanced)

Use the root `vercel.json` configuration with routing:
- `/` → Admin Dashboard
- `/admin/*` → Admin Dashboard
- `/customer/*` → Customer Portal
- `/portal/*` → Customer Portal 3002

## After Deployment:

1. **Update NEXT_PUBLIC_APP_URL** in Vercel environment variables with your actual Vercel URLs
2. **Redeploy** to apply the new environment variables
3. **Test** all three applications

## Troubleshooting:

- **Build fails**: Check that all environment variables are set correctly
- **Supabase connection fails**: Verify the URL and anon key are correct
- **Routing issues**: Check the vercel.json configuration
- **Environment variables not working**: Make sure they're set in the correct Vercel project

## Current Status:
✅ Build works locally
✅ Supabase connection working
✅ Environment variables properly configured
✅ Ready for Vercel deployment
