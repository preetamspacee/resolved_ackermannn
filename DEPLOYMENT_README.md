# BSM Platform - Production Deployment Guide

## 🚀 Render Deployment

This project is configured for deployment on Render with two separate services:

### Services

1. **Admin Dashboard** - `bsm-admin-dashboard`
   - Port: 3001
   - Health Check: `/welcome`
   - URL: `https://bsm-admin-dashboard.onrender.com`

2. **Customer Portal** - `bsm-customer-portal`
   - Port: 3000
   - Health Check: `/`
   - URL: `https://bsm-customer-portal.onrender.com`

### Environment Variables

Both services require these environment variables:

```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://zrxoiqhivfkgzvyoobki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
NEXT_PUBLIC_APP_URL=https://your-service-name.onrender.com
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**
   - In Render dashboard, go to each service
   - Add the environment variables listed above
   - Replace `your_actual_supabase_anon_key_here` with your real Supabase anon key

4. **Deploy**
   - Render will automatically build and deploy both services
   - Monitor the build logs for any issues

### Build Commands

- **Admin Dashboard**: `npm run build:admin`
- **Customer Portal**: `npm run build:customer`
- **Both**: `npm run build`

### Start Commands

- **Admin Dashboard**: `npm run start:admin`
- **Customer Portal**: `npm run start:customer`
- **Both**: `npm run start`

### Health Checks

- Admin Dashboard: `GET /welcome`
- Customer Portal: `GET /`

### Troubleshooting

1. **Build Failures**
   - Check the build logs in Render dashboard
   - Ensure all environment variables are set
   - Verify Supabase connection

2. **Runtime Errors**
   - Check the service logs
   - Verify environment variables are correctly set
   - Test Supabase connectivity

3. **Performance Issues**
   - Monitor resource usage in Render dashboard
   - Consider upgrading to a higher plan if needed

### Post-Deployment

1. **Update Supabase Settings**
   - Add your Render URLs to Supabase Auth settings
   - Update OAuth redirect URLs if using Google OAuth

2. **Test Both Applications**
   - Visit both service URLs
   - Test authentication flows
   - Verify all features work correctly

3. **Monitor**
   - Set up monitoring and alerts
   - Monitor performance and error rates

## 🔧 Local Development

### Quick Start

```bash
# Install dependencies
npm install

# Run both apps in development
npm run dev
```

### Individual Services

```bash
# Admin Dashboard (localhost:3001)
npm run dev:admin
# Visit: http://localhost:3001

# Customer Portal (localhost:3000)
npm run dev:customer
# Visit: http://localhost:3000
```

### Environment Setup for Local Development

Create `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zrxoiqhivfkgzvyoobki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here

# Google OAuth Configuration (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Local Development URLs

- **Customer Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Main App**: http://localhost:3003 (if running from root)

### Development Commands

```bash
# Install dependencies
npm install

# Run development servers
npm run dev              # Both apps
npm run dev:admin        # Admin only
npm run dev:customer     # Customer only

# Build for production
npm run build            # Both apps
npm run build:admin      # Admin only
npm run build:customer   # Customer only

# Start production builds
npm run start            # Both apps
npm run start:admin      # Admin only
npm run start:customer   # Customer only

# Linting and formatting
npm run lint
npm run format
```

## 📊 Production Features

- ✅ TypeScript compilation
- ✅ Production optimizations
- ✅ Security headers
- ✅ Error handling
- ✅ Performance monitoring
- ✅ Health checks
- ✅ Auto-scaling on Render

## 🎯 Next Steps

After successful deployment:

1. Set up custom domains (optional)
2. Configure SSL certificates
3. Set up monitoring and logging
4. Implement CI/CD pipeline
5. Add performance monitoring
6. Set up backup strategies

---

**BSM Platform** - Ready for production deployment! 🚀
