-- ================================
-- Insert Constraint Category Check
-- ================================


ALTER TABLE public."Service" 
ADD CONSTRAINT service_category_check 
CHECK (category IN ('massage', 'spa', 'facial', 'body_wrap', 'nail_care', 'aromatherapy', 'bundle'));


CREATE POLICY "Allows Deletion For Admin"
ON "Service"
FOR DELETE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM "Users" WHERE role = 'admin')
);
