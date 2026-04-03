-- ================================
-- Authenticated Check For Updating/Delete/Add Orders
-- ================================


CREATE POLICY "Allow User Insert when Creating an Order"
ON "OrderItem"
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated')

-- Member can select their own orders and create own order rows
CREATE POLICY "Allow member select own orders"
ON public."Order"
FOR SELECT
TO authenticated
USING (client_id = auth.uid() OR auth.role() = 'authenticated' AND exists (
  select 1 from public."Users" u where u.id=auth.uid() and u.role='admin'
));

CREATE POLICY "Allow member insert own order"
ON public."Order"
FOR INSERT
TO authenticated
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Allow member update own order"
ON public."Order"
FOR UPDATE
TO authenticated
USING (client_id = auth.uid());

CREATE POLICY "Allow member delete own order"
ON public."Order"
FOR DELETE
TO authenticated
USING (client_id = auth.uid());