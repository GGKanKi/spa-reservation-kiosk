-- ================================
-- Authenticated Check For Updating/Delete/Add Rooms
-- Insert Constraint Category Check
-- ================================


CREATE POLICY "Allows Deletion For Admin"
ON "Room"
FOR DELETE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);