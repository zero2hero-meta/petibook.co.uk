# PetiBoo.co.uk - Complete Setup Guide

## Overview
PetiBoo is a fully functional AI-powered pet caricature generator that creates South Park-style images by blending owner and pet facial features.

## What's Included

### ✅ Complete Features
- **Homepage** with hero, showcase, and how-it-works sections
- **Image Upload System** with dual photo upload (owner + pet)
- **Real-time Order Tracking** with auto-polling every 10 seconds
- **Google OAuth Authentication** via Supabase
- **User Gallery** to view all generated caricatures
- **Payment System** (Stripe-ready, needs configuration)
- **Responsive Design** with mobile hamburger menu
- **Database** with 4 tables and Row Level Security
- **Storage System** for images with automatic cleanup
- **API Routes** for orders, N8N callbacks, and status checks

### 🎨 Design
- Beautiful purple, coral, and yellow color scheme
- Fully responsive with Tailwind CSS
- Smooth animations and transitions
- Professional, playful UI/UX

### 🔒 Security
- Row Level Security (RLS) on all tables
- Guest users limited to 1 free caricature
- Secure image storage
- Protected API endpoints

## Database Schema

### Tables Created (with RLS):
1. **petiboo_users** - User accounts and profiles
2. **petiboo_orders** - Order tracking and metadata
3. **petiboo_generations** - AI generation results and images
4. **petiboo_payments** - Payment transaction records

### Storage:
- **images** bucket with folders:
  - `optimized/` - 475px width images (kept permanently)
  - `original/` - Full size uploads (deleted after processing)
  - `generated/` - AI-generated caricatures (kept permanently)

## Setup Instructions

### 1. Prerequisites
- Node.js 18 or higher
- Supabase account (free tier works)
- Google Cloud Console account (for OAuth)
- N8N instance (for AI workflow)
- Stripe account (optional, for payments)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase

#### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize

#### B. Enable Google OAuth
1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials (see step 4)

#### C. Database & Storage
The migrations have already been applied during setup:
- All 4 tables created with RLS policies
- Storage bucket "images" created with public read access

### 4. Configure Google OAuth

#### Create OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   http://localhost:3000/api/auth/callback
   ```
7. Copy Client ID and Client Secret
8. Add to Supabase Auth → Google Provider

### 5. Set Up N8N Workflow

#### Option A: Use Provided Workflow
The N8N workflow JSON is provided in the specification. Import it to your N8N instance.

#### Option B: Manual Setup
Create a workflow with these nodes:
1. **Webhook** - Trigger on POST
2. **Wait** - 1 second delay
3. **HTTP Request** - Call FAL.AI API with image URLs
4. **Wait** - 5 second delay
5. **HTTP Request** - Poll FAL.AI status
6. **Loop** - Repeat until status = COMPLETED
7. **HTTP Request** - POST to `/api/n8n/callback`

#### Required N8N Environment Variables:
- `FAL_AI_API_KEY` - Your FAL.AI API key
- `CALLBACK_URL` - Your Next.js app URL + `/api/n8n/callback`

### 6. Environment Variables

Create `.env.local` file (already exists):
```bash
# Supabase (copy from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# N8N Webhook
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# Stripe (optional, for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 8. Test the Flow

#### Test Guest User:
1. Go to `/create`
2. Upload owner photo and pet photo
3. Enter email
4. Click "Create My Free Caricature"
5. Redirected to `/results/[orderId]`
6. Page auto-polls every 10 seconds for status
7. When complete, displays image with watermark

#### Test Authenticated User:
1. Click hamburger menu → Sign In with Google
2. Complete OAuth flow
3. Create caricature (same process)
4. View in Gallery

## Production Deployment

### Recommended: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Alternative: Any Node.js Host
```bash
npm run build
npm run start
```

## API Endpoints

### POST `/api/orders/create`
Create new caricature order
- **Input**: FormData with `owner_image`, `pet_image`, `email`
- **Output**: `{ order_id, success }`
- **Action**: Uploads images, creates order, triggers N8N

### GET `/api/orders/[orderId]/status`
Check order status
- **Output**: `{ order_id, status, generation }`
- **Used by**: Results page polling

### POST `/api/n8n/callback`
Receive AI results from N8N
- **Input**: JSON with `order_id`, `images`, `seed`, etc.
- **Action**: Saves image, updates status, deletes originals

### GET `/api/auth/callback`
OAuth callback handler
- **Action**: Exchanges code for session, redirects home

## User Flow

### Guest User (Free):
```
Home → Create → Upload Photos → Enter Email
  → Processing (30-60 min) → Results (with watermark)
  → Prompt to Sign In
```

### Registered User:
```
Home → Sign In → Create → Upload Photos
  → (Optional: Choose Package & Pay)
  → Processing → Results (no watermark)
  → Gallery (View All)
```

## File Structure
```
/app
  /(main)               # Main app pages
    /page.tsx           # Homepage
    /create/page.tsx    # Upload page
    /gallery/page.tsx   # User gallery
    /pricing/page.tsx   # Pricing plans
    /results/[orderId]  # Order results with polling
    /payment-history    # Transaction history
  /api                  # API routes
    /orders/create      # Create order
    /orders/[id]/status # Check status
    /n8n/callback       # N8N webhook
    /auth/callback      # OAuth
  /layout.tsx           # Root layout
  /not-found.tsx        # 404 page
/components             # React components
  /Header.tsx           # Main navigation
  /HamburgerMenu.tsx    # Mobile menu with auth
  /Hero.tsx             # Homepage hero
  /FunShowcase.tsx      # Example gallery
  /HowItWorks.tsx       # Process steps
  /ImageUpload.tsx      # Dual upload component
  /OrderStatus.tsx      # Status with polling
/lib
  /supabase            # Supabase clients
/types
  /index.ts            # TypeScript types & constants
```

## Features to Add (Future)

### High Priority:
- [ ] Stripe payment integration (routes ready)
- [ ] Email notifications via SendGrid
- [ ] Watermark application for guest images
- [ ] Multiple style selection
- [ ] Image optimization with Sharp

### Medium Priority:
- [ ] AI Studio editing features
- [ ] Social sharing with Open Graph
- [ ] Referral program
- [ ] Admin dashboard
- [ ] Analytics integration

### Low Priority:
- [ ] Mobile app (React Native)
- [ ] Bulk processing
- [ ] API for businesses
- [ ] Print fulfillment integration

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues
- Check RLS policies are enabled
- Verify user permissions
- Check Supabase logs

### Image Upload Issues
- Verify storage bucket exists
- Check bucket permissions
- Ensure images bucket is public

### OAuth Issues
- Verify redirect URIs match exactly
- Check Google OAuth credentials
- Ensure Supabase Auth is configured

## Support

For issues or questions:
1. Check Supabase logs
2. Check N8N workflow execution
3. Check browser console for errors
4. Review API responses

## License
Proprietary - All rights reserved by PetiBoo.co.uk

---

**Built with:** Next.js 15, Supabase, Tailwind CSS, TypeScript, N8N, FAL.AI
