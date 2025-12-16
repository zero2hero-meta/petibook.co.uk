# PetiBoo.co.uk - AI Pet Caricature Generator

Transform your pet into a hilarious South Park-style caricature with your facial features applied!

## Features

- **Guest Access**: Try for free with one caricature (includes watermark)
- **Google Authentication**: Sign in to create unlimited caricatures
- **AI-Powered Generation**: Blends owner's facial features with pet's appearance
- **Multiple Packages**: Free, Starter (£25), Popular (£35), Premium (£45)
- **Image Optimization**: Automatic image processing and optimization
- **Secure Storage**: Images stored in Supabase Storage
- **Order Tracking**: View all your generated caricatures
- **Payment History**: Track your purchases

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Authentication**: Google OAuth via Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe (ready to integrate)
- **AI Processing**: N8N workflow with FAL.AI

## Database Schema

### Tables Created:

1. `petiboo_users` - User accounts and profiles
2. `petiboo_orders` - Order tracking and metadata
3. `petiboo_generations` - AI generation results
4. `petiboo_payments` - Payment transactions

### Storage Buckets:

- `images` - Stores optimized, original, and generated images

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Google OAuth credentials
- N8N workflow URL
- Stripe account (for payments)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
/app
  /(main)           - Main application routes
    /page.tsx       - Homepage
    /create         - Image upload page
    /gallery        - User's caricatures
    /pricing        - Pricing plans
    /results/[id]   - Order results
  /api
    /orders/create  - Create new order
    /n8n/callback   - N8N webhook handler
    /auth/callback  - OAuth callback
/components         - React components
/lib               - Utility functions
/types             - TypeScript types
```

## User Flow

### Guest User (Free):

1. Upload owner and pet photos
2. Enter email address
3. Wait for AI generation (30-60 min)
4. Receive 1 caricature with watermark
5. Prompted to sign in for more

### Registered User:

1. Sign in with Google
2. Upload photos
3. Choose package (paid)
4. Complete payment via Stripe
5. Receive multiple caricatures without watermark

## N8N Integration

The application integrates with an N8N workflow that:

1. Receives image URLs from the order creation endpoint
2. Calls FAL.AI API for image generation
3. Polls for completion
4. Sends results back to `/api/n8n/callback`

### Required N8N Workflow Steps:

1. Webhook trigger
2. Wait 1 second
3. Call FAL.AI API
4. Poll status (5-second intervals)
5. POST results to callback URL

## Image Processing

- **Optimized images**: Resized to 475px width, stored permanently
- **Original images**: Full size, deleted after AI processing
- **Generated images**: Stored permanently with optional watermark

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Guest users tracked by email
- Secure image storage with public read access
- Payment data protected

## API Endpoints

### POST /api/orders/create

Create a new caricature order

- Accepts: FormData with owner_image, pet_image, email
- Returns: order_id

### POST /api/n8n/callback

Receive AI generation results from N8N

- Accepts: JSON with order_id, images, metadata
- Updates order and generation status

### GET /api/auth/callback

OAuth callback handler for Google Sign-In

## TODO: Additional Features

- [ ] Stripe payment integration
- [ ] Email notifications (SendGrid)
- [ ] Watermark application for guest users
- [ ] Image optimization with Sharp
- [ ] Multiple style selection
- [ ] AI Studio editing features
- [ ] Social sharing functionality
- [ ] Referral program

## Environment Setup

### Supabase Setup:

1. Create a new Supabase project
2. Enable Google OAuth in Authentication settings
3. Run the provided migrations (already applied)
4. Create storage bucket named "images"

### Supabase migration

to create tables on the supabase:

```bash
$ supabase secrets set --project-ref   your-project-ref> \
  SUPABASE_URL=https://... \
  SUPABASE_SERVICE_ROLE_KEY=...
```

Creating all tables in Supabase

```bash
#login
❯ npx supabase login

#supabase project ref
❯ npx supabase link --project-ref erliripjhdznygvoxnpw

# if needed
❯ npx supabase migration repair --status reverted 20251208024100

# creates tables
❯ npx supabase db push
```

From the repo root, deploy the function

```bash
supabase functions deploy generation-callback --project-ref <your-project-ref>
```

### Google OAuth Setup:

1. Create project in Google Cloud Console
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add to Supabase Auth providers

### N8N Setup:

1. Create N8N workflow from provided JSON
2. Configure FAL.AI API credentials
3. Update callback URL to your domain
4. Copy webhook URL to .env.local

## Contributing

This is a production-ready application for PetiBoo.co.uk.

## License

Proprietary - All rights reserved
