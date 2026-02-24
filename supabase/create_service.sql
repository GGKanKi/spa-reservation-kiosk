-- ============================================================================
-- CREATE SERVICES TABLE AND ITS FUNCTIONS
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================

-- Table Creation
CREATE TABLE IF NOT EXISTS public."Service" (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    category TEXT,
    price NUMERIC,
    description TEXT,
    created TIMESTAMPTZ DEFAULT now()

);


-- ENABLE RLS 
ALTER TABLE public."Service" ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users can see available spa services."
ON public."Service"
FOR SELECT
USING (true);


CREATE POLICY "Only admins can add services."
ON public."Service"
FOR ALL
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public."Users"
        WHERE id = auth.uid() and role = 'admin'
    )
);


-- ============================================================================
-- TO BE UPDATED WITH DELETE FUNCTIONS/POLICIES
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================