-- ============================================================================
-- POLICIES FOR UPDATING MEMBER TO STAFF
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================

CREATE POLICY "Allow Admins to Make Member promote to staff"
ON "Users"
FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);

CREATE POLICY "Allow Admins to Make Member promote to staff"
ON "Room"
FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);

CREATE POLICY "Allow Admins to Make Member promote to staff"
ON "Order"
FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);

CREATE POLICY "Allow Admins to Make Member promote to staff"
ON "Reservation"
FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);

CREATE POLICY "Allow Admins to Make Member promote to staff"
ON "Service"
FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);


-- ========================================================
-- DONE - Admin Authorization for updating data in SUPABASE
-- ========================================================