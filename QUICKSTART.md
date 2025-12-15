# Quick Start Guide - PetiBoo.co.uk

Get PetiBoo running in 5 minutes!

## Prerequisites
- Node.js 18+
- Supabase account (the database and migrations are already set up)
- N8N instance with FAL.AI integration

## Setup in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.local` file already exists. Update these values:

```bash
# Get these from your Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Your N8N webhook URL
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/your-id
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ What's Already Set Up

- ✅ Database schema (4 tables with RLS)
- ✅ Storage bucket for images
- ✅ All pages and components
- ✅ API routes
- ✅ Authentication flow
- ✅ Real-time order polling
- ✅ Responsive design

## 🧪 Test It Out

### Test Guest User (No Login):
1. Go to `/create`
2. Upload your photo and your pet's photo
3. Enter your email
4. Click "Create My Free Caricature"
5. Watch the real-time status updates!

### Test Authenticated User:
1. Click the hamburger menu (top right)
2. Click "Sign In with Google"
3. Complete Google OAuth
4. Create caricatures without limits
5. View your gallery at `/gallery`

## 📋 What You Need to Configure

### Google OAuth (Required for Sign In):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Add credentials to Supabase → Authentication → Providers → Google

### N8N Workflow (Required for AI Generation):
The workflow needs:
- FAL.AI API key
- Webhook trigger
- Callback to your app's `/api/n8n/callback` endpoint

### Stripe (Optional - for Payments):
1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add to `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🚀 Deploy to Production

### Vercel (Recommended):
```bash
vercel
```

Add environment variables in Vercel dashboard.

### Build for Production:
```bash
npm run build
npm run start
```

## 📖 Need More Help?
See `SETUP.md` for detailed instructions and troubleshooting.

## 🎉 You're Ready!
The app is fully functional and ready to use. Just configure your external services (Google OAuth, N8N) and you're good to go!
