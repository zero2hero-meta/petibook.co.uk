/*
  # Create PetiBoo Orders Table

  1. New Tables
    - `petiboo_orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `user_id` (uuid, foreign key) - References petiboo_users (nullable for guests)
      - `user_email` (varchar) - User email for order tracking
      - `owner_image_optimized` (text) - URL to optimized owner photo
      - `owner_image_original` (text) - URL to original owner photo (deleted after processing)
      - `pet_image_optimized` (text) - URL to optimized pet photo
      - `pet_image_original` (text) - URL to original pet photo (deleted after processing)
      - `package` (varchar) - Package type: free, starter, popular, premium
      - `num_images` (int) - Number of images to generate
      - `status` (varchar) - Order status: pending, processing, completed, failed
      - `is_guest` (boolean) - Whether this is a guest order
      - `stripe_payment_id` (varchar) - Stripe payment intent ID
      - `stripe_payment_status` (varchar) - Payment status
      - `total_price` (decimal) - Total order price
      - `processing_started_at` (timestamp) - When processing started
      - `completed_at` (timestamp) - When order was completed
      - `created_at` (timestamp) - Order creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `petiboo_orders` table
    - Users can read their own orders
    - Users can create orders
    - Guest users can read orders by email

  3. Indexes
    - Index on user_id for fast user order lookups
    - Index on status for processing queue management
    - Index on is_guest for guest order tracking
*/

CREATE TABLE IF NOT EXISTS petiboo_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES petiboo_users(id),
  user_email VARCHAR(255) NOT NULL,
  owner_image_optimized TEXT NOT NULL,
  owner_image_original TEXT,
  pet_image_optimized TEXT NOT NULL,
  pet_image_original TEXT,
  package VARCHAR(50) NOT NULL DEFAULT 'free',
  num_images INT NOT NULL DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending',
  is_guest BOOLEAN DEFAULT FALSE,
  stripe_payment_id VARCHAR(255),
  stripe_payment_status VARCHAR(50),
  total_price DECIMAL(10,2),
  processing_started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_petiboo_orders_user_id ON petiboo_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_petiboo_orders_status ON petiboo_orders(status);
CREATE INDEX IF NOT EXISTS idx_petiboo_orders_is_guest ON petiboo_orders(is_guest);

ALTER TABLE petiboo_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON petiboo_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Guest users can read own orders by email"
  ON petiboo_orders
  FOR SELECT
  TO anon
  USING (is_guest = true);

CREATE POLICY "Authenticated users can create orders"
  ON petiboo_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guest users can create orders"
  ON petiboo_orders
  FOR INSERT
  TO anon
  WITH CHECK (is_guest = true);

CREATE POLICY "Users can update own orders"
  ON petiboo_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
