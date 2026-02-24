-- ============================================================================
-- CREATE Reservation TABLE AND ITS FUNCTIONS
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================

CREATE TABLE IF NOT EXISTS public."Reservation" (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    client_id uuid REFERENCES public."Users"(id) ON DELETE SET NULL,
    room_id uuid REFERENCES public."Room"(id) ON DELETE SET NULL,
    staff_id uuid REFERENCES public."Users"(id)  ON DELETE SET NULL,
    reservation_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()

);

-- ENABLE RLS POLICIES
ALTER TABLE public."Reservation" ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users can see relevant Reservations"
ON public."Reservation"
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public."Users"
        WHERE id = auth.uid() AND (
            role = 'admin' OR           -- Admins see all
            id = client_id OR           -- Clients see their own
            id = staff_id               -- Staff see their assigned work
        )
    )
);


-- Assuming only Admins manage Reservations
CREATE POLICY "Only admins can manage Reservations"
ON public."Reservation"
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public."Users"
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
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