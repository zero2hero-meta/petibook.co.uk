/*
  # Add order_index to petiboo_generations

  The column name "order" conflicts with PostgREST's order query parameter.
  Introduce order_index and backfill from the legacy column.
*/

ALTER TABLE petiboo_generations
ADD COLUMN IF NOT EXISTS order_index INTEGER;

UPDATE petiboo_generations
SET order_index = "order"
WHERE order_index IS NULL;

CREATE INDEX IF NOT EXISTS idx_petiboo_generations_order_index
  ON petiboo_generations(order_id, order_index);
