/*
  # Add display order to petiboo_generations

  Adds a numeric "order" column to allow ordering generated images per order.
*/

ALTER TABLE petiboo_generations
ADD COLUMN IF NOT EXISTS "order" INTEGER;
