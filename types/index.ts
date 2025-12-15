export interface User {
  id: string
  email: string
  name?: string
  google_id?: string
  avatar_url?: string
  free_generation_used: boolean
  created_at: string
  last_login_at?: string
}

export interface Order {
  id: string
  user_id?: string
  user_email: string
  owner_image_optimized: string
  owner_image_original?: string
  pet_image_optimized: string
  pet_image_original?: string
  package: 'free' | 'starter' | 'popular' | 'premium'
  num_images: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  is_guest: boolean
  stripe_payment_id?: string
  stripe_payment_status?: string
  total_price?: number
  processing_started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  order_id: string
  n8n_request_id?: string
  fal_image_url?: string
  permanent_image_url?: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  has_watermark: boolean
  width?: number
  height?: number
  content_type?: string
  seed?: number
  prompt?: string
  has_nsfw_concepts: boolean
  error_message?: string
  retry_count: number
  created_at: string
  completed_at?: string
}

export interface Payment {
  id: string
  order_id: string
  user_id: string
  stripe_payment_intent_id: string
  stripe_session_id?: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  payment_method?: string
  created_at: string
  paid_at?: string
}

export interface PackageConfig {
  name: string
  price: number
  images_per_style: number
  max_styles: number
  processing_time: string
  ai_edits: number
  human_edits?: string
  features: string[]
}

export const PACKAGES: Record<string, PackageConfig> = {
  free: {
    name: 'Free',
    price: 0,
    images_per_style: 1,
    max_styles: 1,
    processing_time: '2 hours',
    ai_edits: 0,
    features: [
      '1 caricature with watermark',
      'South Park style',
      'No login required',
      'Try before you buy'
    ]
  },
  starter: {
    name: 'Starter',
    price: 25,
    images_per_style: 20,
    max_styles: 1,
    processing_time: '2 hours',
    ai_edits: 2,
    features: [
      '20 high-quality 4K caricatures',
      '1 style',
      'Ready in 2 hours',
      'Email support in 48 hours',
      '2 AI Studio edits',
      'Commercial license'
    ]
  },
  popular: {
    name: 'Popular',
    price: 35,
    images_per_style: 20,
    max_styles: 3,
    processing_time: '1.5 hours',
    ai_edits: 4,
    features: [
      '60 high-quality 4K caricatures',
      '3 styles',
      'Ready in 1.5 hours',
      'Email support in 24 hours',
      '4 AI Studio edits',
      'Commercial license'
    ]
  },
  premium: {
    name: 'Premium',
    price: 45,
    images_per_style: 20,
    max_styles: 6,
    processing_time: '1 hour',
    ai_edits: 8,
    human_edits: 'unlimited_on_one',
    features: [
      '120 high-quality 4K caricatures',
      '6 styles',
      'Ready in 1 hour',
      'Priority support in 12 hours',
      '8 AI Studio edits',
      'Unlimited human edits on 1 photo',
      '1 free redo',
      'Commercial license'
    ]
  }
}
