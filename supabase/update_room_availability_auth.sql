-- ================================
-- Insert Constraint Category Check
-- ================================

ALTER TABLE public."Room" 
ADD CONSTRAINT room_availability_check 
CHECK (is_available IN ('available', 'cleaning', 'closed', 'reserved', 'maintenance'));