/*
  # Create PetiBoo Users Table

  1. New Tables
    - `petiboo_users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (varchar) - User email address, unique
      - `name` (varchar) - User display name
      - `google_id` (varchar) - Google OAuth ID, unique
      - `avatar_url` (text) - URL to user's profile picture
      - `free_generation_used` (boolean) - Flag for whether user has used free generation
      - `created_at` (timestamp) - Account creation timestamp
      - `last_login_at` (timestamp) - Last login timestamp

  2. Security
    - Enable RLS on `petiboo_users` table
    - Add policy for users to read their own data
    - Add policy for users to update their own data
    - Add policy for authenticated users to insert their own data

  3. Indexes
    - Index on email for fast lookups
    - Index on google_id for OAuth authentication
*/

CREATE TABLE IF NOT EXISTS petiboo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  free_generation_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_petiboo_users_email ON petiboo_users(email);
CREATE INDEX IF NOT EXISTS idx_petiboo_users_google_id ON petiboo_users(google_id);

ALTER TABLE petiboo_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON petiboo_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON petiboo_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON petiboo_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
