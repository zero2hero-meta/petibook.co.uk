/*
  # Create petiboo_quotas for package limits and add stripe_customer_id

  - Tracks remaining images/styles per user based on purchased package.
  - Stores package metadata for enforcement.
  - Adds stripe_customer_id to petiboo_users for subscription management.
*/

CREATE TABLE IF NOT EXISTS petiboo_quotas (
  user_id UUID PRIMARY KEY REFERENCES petiboo_users(id) ON DELETE CASCADE,
  package VARCHAR(50) NOT NULL,
  remaining_images INT NOT NULL DEFAULT 0,
  remaining_styles INT NOT NULL DEFAULT 0,
  images_per_style INT NOT NULL DEFAULT 0,
  max_styles INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE petiboo_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quotas"
  ON petiboo_quotas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quotas"
  ON petiboo_quotas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE petiboo_users
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
