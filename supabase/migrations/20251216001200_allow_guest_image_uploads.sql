/*
  # Allow guest uploads to images bucket

  Guest checkout relies on /api/orders/create, which runs without an
  authenticated Supabase session. The existing storage policy only allowed
  `authenticated` users to insert objects, so uploads for guests failed with
  `new row violates row-level security policy for table storage.objects`.

  This policy lets anonymous clients upload into the public `images` bucket,
  while keeping the bucket scoped by id.
*/

CREATE POLICY "Guest users can upload images"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'images');
