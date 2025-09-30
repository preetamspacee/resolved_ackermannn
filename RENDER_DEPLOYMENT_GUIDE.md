# Render Deployment Guide

## Current Status ✅
- All three apps are building successfully
- Dev servers are running locally
- Render configuration is ready

## Local Development URLs
- **Customer Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001  
- **Customer Portal (3002)**: http://localhost:3002

## Render Deployment Steps

### 1. Update Environment Variables
Before deploying, replace `your_actual_supabase_anon_key_here` in `render.yaml` with your real Supabase anon key from:
- Go to https://zrxoiqhivfkgzvyoobki.supabase.co
- Settings → API → Project API keys
- Copy the "anon public" key

### 2. Deploy to Render
1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically detect the `render.yaml` file
4. Three services will be created:
   - `bsm-admin-dashboard` → https://bsm-admin-dashboard.onrender.com
   - `bsm-customer-portal` → https://bsm-customer-portal.onrender.com
   - `bsm-customer-portal-3002` → https://bsm-customer-portal-3002.onrender.com

### 3. Environment Variables in Render Dashboard
For each service, set these environment variables:
- `NODE_ENV` = `production`
- `NEXT_PUBLIC_SUPABASE_URL` = `https://zrxoiqhivfkgzvyoobki.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[your_actual_anon_key]`
- `NEXT_PUBLIC_APP_URL` = `[service_url]`

## Build Commands
- Admin Dashboard: `npm run build:admin`
- Customer Portal: `npm run build:customer`
- Customer Portal 3002: `npm run build:customer3002`

## Start Commands
- Admin Dashboard: `npm run start:admin`
- Customer Portal: `npm run start:customer`
- Customer Portal 3002: `npm run start:customer3002`

## Health Check Paths
- Admin Dashboard: `/welcome`
- Customer Portal: `/`
- Customer Portal 3002: `/`

## Troubleshooting
- If build fails, check that all environment variables are set
- If runtime errors occur, verify Supabase connection
- Check Render logs for detailed error messages
