# DemoAck - BSM Platform Demo (15% Preview)

A minimal, working demonstration of the BSM Platform featuring authentication and welcome functionality. This represents 15% of the full BSM Platform capabilities.

## 🚀 Features (15% Preview)

* **Authentication**: Email/password and Google OAuth login
* **Welcome Page**: Personalized welcome message after login
* **Supabase Integration**: Real-time authentication with your Supabase backend
* **Responsive Design**: Modern UI with Tailwind CSS
* **TypeScript Support**: Type-safe development

## 📋 What's Included (15% of Full Platform)

### ✅ Included Features:
- User authentication (login/signup)
- Google OAuth integration
- Welcome dashboard
- User profile display
- Responsive design
- Supabase backend integration

### 🔮 Full Platform Features (Not Included):
- Customer Portal (tickets, services, ratings)
- Admin Dashboard (analytics, workflows, knowledge base)
- Workflow Builder with AI integration
- Knowledge Base management
- Integrations management
- Advanced ticket management
- Rules engine
- AI-powered features

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zrxoiqhivfkgzvyoobki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google OAuth Configuration (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Open Your Browser

Visit [http://localhost:3003](http://localhost:3003) in your browser.

## 📁 Project Structure

```
demoack-bsm-minimal/
├── pages/
│   ├── index.tsx          # Redirects based on auth status
│   ├── login.tsx          # Login/signup page
│   ├── welcome.tsx        # Welcome dashboard
│   └── auth/
│       └── callback.tsx   # OAuth callback handler
├── lib/
│   └── supabase.ts        # Supabase client configuration
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🔧 Supabase Setup

This demo uses your existing Supabase project at `https://zrxoiqhivfkgzvyoobki.supabase.co`.

### Required Configuration:

1. **Authentication Settings**:
   - Enable email/password authentication
   - Enable Google OAuth provider
   - Set up OAuth redirect URLs

2. **Database Tables**:
   - Uses Supabase Auth (no additional tables required for basic functionality)

3. **Row Level Security (RLS)**:
   - Auth policies are handled automatically by Supabase Auth

## 🌐 Pages

* `/` - Redirects to login or welcome based on auth status
* `/login` - Login and signup page with email/password and Google OAuth
* `/welcome` - Welcome page showing personalized message and platform overview
* `/auth/callback` - OAuth callback handler for Google authentication

## 🎯 Authentication Flow

1. User visits the app
2. If not authenticated, redirected to `/login`
3. User can sign in with email/password or Google OAuth
4. After successful login, redirected to `/welcome`
5. Welcome page shows personalized message with platform overview
6. User can sign out to return to login

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📊 Tech Stack

* **Next.js 14** - React framework
* **TypeScript** - Type safety
* **Tailwind CSS** - Styling
* **Supabase** - Authentication and backend
* **Lucide React** - Icons

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `NEXT_PUBLIC_APP_URL` | Your app URL for OAuth callbacks | Yes |

## 🐛 Troubleshooting

### Common Issues:

1. **Authentication not working**: Check your Supabase URL and anon key
2. **Google OAuth not working**: Verify Google client ID and redirect URIs
3. **Build errors**: Ensure all environment variables are set

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Check the console for error messages

## 🎉 What's Next?

This is a 15% preview of the full BSM Platform. The complete platform includes:

- **Customer Portal**: Ticket management, service requests, ratings
- **Admin Dashboard**: Analytics, user management, system configuration
- **Workflow Builder**: AI-powered workflow creation and management
- **Knowledge Base**: Article management and search
- **Integrations**: Third-party service connections
- **Rules Engine**: Automated business logic
- **AI Features**: Sentiment analysis, auto-categorization, predictive routing

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a demo version. For the full BSM Platform, contact the development team.

---

**DemoAck** - Experience 15% of the BSM Platform's power! 🚀