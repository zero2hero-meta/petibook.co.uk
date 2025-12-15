/*
  # Create PetiBoo Payments Table

  1. New Tables
    - `petiboo_payments`
      - `id` (uuid, primary key) - Unique payment identifier
      - `order_id` (uuid, foreign key) - References petiboo_orders
      - `user_id` (uuid, foreign key) - References petiboo_users
      - `stripe_payment_intent_id` (varchar) - Stripe payment intent ID, unique
      - `stripe_session_id` (varchar) - Stripe checkout session ID
      - `amount` (decimal) - Payment amount in GBP
      - `currency` (varchar) - Currency code, defaults to GBP
      - `status` (varchar) - Payment status: pending, succeeded, failed, refunded
      - `payment_method` (varchar) - Payment method type
      - `created_at` (timestamp) - Payment creation timestamp
      - `paid_at` (timestamp) - Payment completion timestamp

  2. Security
    - Enable RLS on `petiboo_payments` table
    - Users can read their own payments
    - Users can read payments for their orders
    - System can create and update payments

  3. Indexes
    - Index on user_id for fast user payment lookups
    - Index on order_id for order payment tracking
    - Index on stripe_payment_intent_id for webhook processing
*/

CREATE TABLE IF NOT EXISTS petiboo_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES petiboo_orders(id),
  user_id UUID REFERENCES petiboo_users(id),
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GBP',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_petiboo_payments_user_id ON petiboo_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_petiboo_payments_order_id ON petiboo_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_petiboo_payments_stripe_payment_intent_id ON petiboo_payments(stripe_payment_intent_id);

ALTER TABLE petiboo_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON petiboo_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read payments for own orders"
  ON petiboo_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_payments.order_id
      AND petiboo_orders.user_id = auth.uid()
    )
  );
