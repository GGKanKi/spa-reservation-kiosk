-- ============================================================================
-- CREATE ROOM TABLE AND ITS FUNCTIONS
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================

CREATE TABLE IF NOT EXISTS public."Room" (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    assigned_id uuid REFERENCES public."Users"(id) ON DELETE SET NULL,
    assigned_name TEXT,
    is_available TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()

);

-- ENABLE RLS POLICIES
ALTER TABLE public."Room" ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users Can See All Rooms"
ON public."Room"
FOR SELECT
USING (true);


-- Assuming only Admins manage rooms
CREATE POLICY "Only admins can manage rooms"
ON public."Room"
FOR ALL -- This covers INSERT, UPDATE, and DELETE
USING (
    EXISTS (
        SELECT 1 FROM public."Users"
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================================================
-- TO BE UPDATED WITH DELETE FUNCTIONS/POLICIES
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================