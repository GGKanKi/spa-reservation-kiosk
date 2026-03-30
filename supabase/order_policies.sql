-- ================================
-- Authenticated Check For Updating/Delete/Add Orders
-- ================================


CREATE POLICY "Allow User Insert when Creating an Order"
ON "OrderItem"
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated')