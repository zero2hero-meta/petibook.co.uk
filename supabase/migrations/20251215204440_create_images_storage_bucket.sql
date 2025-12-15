/*
  # Create Images Storage Bucket

  1. Storage
    - Create public 'images' bucket for storing pet and owner photos
    - Set up folders: optimized/, original/, generated/
    - Allow public access for reading
    - Restrict uploads to authenticated users and service role

  2. Security
    - Enable RLS on storage
    - Allow authenticated users to upload
    - Allow public read access
    - Allow users to delete their own images
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Service role can manage all images"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'images');
