# Ackermann App Deployment Guide

## Supabase Database Setup

### 1. Deploy Database Schema

1. Go to your Supabase project dashboard: https://zrxoiqhivfkgzvyoobki.supabase.co
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute the schema

### 2. Configure Authentication

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure the following:

#### Email Authentication
- Enable **Email** provider
- Set **Site URL** to your app URL (e.g., `http://localhost:3002` for development)
- Configure email templates if needed

#### Google OAuth
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add **Redirect URLs**:
   - `http://localhost:3002/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 3. Get Your Supabase Credentials

1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy:
   - **Project URL**: `https://zrxoiqhivfkgzvyoobki.supabase.co`
   - **Anon Key**: Your anonymous/public key

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add **Authorized redirect URIs**:
   - `http://localhost:3002/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
5. Copy the **Client ID** and **Client Secret**

### 3. Configure Supabase

Add the Google credentials to your Supabase project:
1. Go to **Authentication** > **Providers** > **Google**
2. Enter your **Client ID** and **Client Secret**
3. Save the configuration

## Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zrxoiqhivfkgzvyoobki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## Testing the Setup

### 1. Start the Application

```bash
npm install
npm run dev
```

### 2. Test Authentication

1. Visit `http://localhost:3002`
2. You should be redirected to `/login`
3. Try both email/password and Google OAuth login
4. After successful login, you should see the welcome page

### 3. Verify Database

1. Go to your Supabase dashboard
2. Check **Table Editor** > **profiles**
3. You should see user data populated after login

## Production Deployment

### 1. Update Environment Variables

For production, update your environment variables:
- Change `NEXT_PUBLIC_APP_URL` to your production domain
- Update Google OAuth redirect URIs
- Update Supabase site URL

### 2. Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 3. Update Supabase Settings

1. Update **Site URL** in Supabase Auth settings
2. Add production redirect URLs for Google OAuth

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**: Check Google OAuth redirect URIs
2. **"Invalid client"**: Verify Google Client ID and Secret
3. **Database errors**: Ensure schema is deployed correctly
4. **Auth not working**: Check Supabase URL and anon key

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Supabase logs in dashboard
4. Test with different browsers/incognito mode

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys and secrets
- Enable Row Level Security (RLS) on all tables
- Use HTTPS in production
