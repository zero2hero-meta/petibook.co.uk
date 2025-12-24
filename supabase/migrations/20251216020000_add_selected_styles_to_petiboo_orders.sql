/*
  # Add selected_styles to petiboo_orders

  - Adds a text[] column to store the selected style identifiers for each order.
*/

ALTER TABLE petiboo_orders
ADD COLUMN IF NOT EXISTS selected_styles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
