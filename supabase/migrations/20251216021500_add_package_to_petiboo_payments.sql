/*
  # Add package to petiboo_payments

  - Adds a package column to store which package was purchased.
*/

ALTER TABLE petiboo_payments
ADD COLUMN IF NOT EXISTS package VARCHAR(50);
