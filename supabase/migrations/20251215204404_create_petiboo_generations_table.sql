/*
  # Create PetiBoo Generations Table

  1. New Tables
    - `petiboo_generations`
      - `id` (uuid, primary key) - Unique generation identifier
      - `order_id` (uuid, foreign key) - References petiboo_orders with cascade delete
      - `n8n_request_id` (varchar) - N8N workflow request identifier, unique
      - `fal_image_url` (text) - Temporary URL from FAL.AI
      - `permanent_image_url` (text) - Permanent storage URL
      - `status` (varchar) - Generation status: queued, processing, completed, failed
      - `has_watermark` (boolean) - Whether image has watermark (for guest users)
      - `width` (int) - Image width in pixels
      - `height` (int) - Image height in pixels
      - `content_type` (varchar) - Image MIME type
      - `seed` (bigint) - AI generation seed for reproducibility
      - `prompt` (text) - Full prompt used for generation
      - `has_nsfw_concepts` (boolean) - Flag from AI model for content safety
      - `error_message` (text) - Error details if generation failed
      - `retry_count` (int) - Number of retry attempts
      - `created_at` (timestamp) - Generation creation timestamp
      - `completed_at` (timestamp) - Generation completion timestamp

  2. Security
    - Enable RLS on `petiboo_generations` table
    - Users can read generations for their orders
    - Guest users can read generations for their orders
    - System can create and update generations

  3. Indexes
    - Index on order_id for fast order lookup
    - Index on status for processing queue management
    - Index on n8n_request_id for webhook callbacks
*/

CREATE TABLE IF NOT EXISTS petiboo_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES petiboo_orders(id) ON DELETE CASCADE,
  n8n_request_id VARCHAR(255) UNIQUE,
  fal_image_url TEXT,
  permanent_image_url TEXT,
  status VARCHAR(50) DEFAULT 'queued',
  has_watermark BOOLEAN DEFAULT FALSE,
  width INT,
  height INT,
  content_type VARCHAR(50),
  seed BIGINT,
  prompt TEXT,
  has_nsfw_concepts BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_petiboo_generations_order_id ON petiboo_generations(order_id);
CREATE INDEX IF NOT EXISTS idx_petiboo_generations_status ON petiboo_generations(status);
CREATE INDEX IF NOT EXISTS idx_petiboo_generations_n8n_request_id ON petiboo_generations(n8n_request_id);

ALTER TABLE petiboo_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read generations for own orders"
  ON petiboo_generations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Guest users can read generations for own orders"
  ON petiboo_generations
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.is_guest = true
    )
  );
