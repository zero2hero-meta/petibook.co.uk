/*
  # Add Insert and Update Policies for PetiBoo Generations Table

  Adds missing INSERT and UPDATE policies to allow the API to create and update generations.
*/

-- Allow authenticated users to insert generations for their orders
CREATE POLICY "Authenticated users can create generations for own orders"
  ON petiboo_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.user_id = auth.uid()
    )
  );

-- Allow guest users to insert generations for their orders
CREATE POLICY "Guest users can create generations for own orders"
  ON petiboo_generations
  FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.is_guest = true
    )
  );

-- Allow authenticated users to update generations for their orders
CREATE POLICY "Authenticated users can update generations for own orders"
  ON petiboo_generations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.user_id = auth.uid()
    )
  );

-- Allow guest users to update generations for their orders
CREATE POLICY "Guest users can update generations for own orders"
  ON petiboo_generations
  FOR UPDATE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.is_guest = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM petiboo_orders
      WHERE petiboo_orders.id = petiboo_generations.order_id
      AND petiboo_orders.is_guest = true
    )
  );
