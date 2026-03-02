-- ============================================================================
-- CREATE USERS FROM SIGNUP AND ADD DATA TO USER AUTHENTICATION AND USER TABLES
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================

-- CREATE USERS TABLE
CREATE TABLE IF NOT EXISTS public."Users" (
    -- CHANGED TO UUID: This matches the Auth Layer
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    email_add TEXT,
    phone_num TEXT,
    -- PASSWORD AUTOMATICALLY WILL GET HANDLED BY SUPABASE
    created_at TIMESTAMPTZ DEFAULT now(),
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member' , 'vip' , 'admin' , 'staff'))

);

-- RLS ENABLE
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users Can See Their Profile Information"
ON public."Users"
FOR SELECT
USING (auth.uid() = id);

-- SETTING POLICY
CREATE POLICY "Users can update their own profile" 
ON public."Users" 
FOR UPDATE 
USING (auth.uid() = id);

-- PUTS DATA INSIDE THE 1st AUTH LAYER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Users"(id, first_name, email_add, role)
    VALUES (
        new.id, -- This is now a UUID
        new.raw_user_meta_data->>'first_name',
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'member')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind 2 INSERT FUNCTIONS WHEN CREATING USER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================
-- SERVICES TABLE AND POLICIES
-- ============================

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


-- ============================
-- ROOM TABLE AND POLICIES
-- ============================

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



-- ==============================
-- RESERVATION TABLE AND POLICIES
-- ==============================


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



-- ============================
-- ORDER TABLE AND POLICIES
-- ============================


CREATE TABLE IF NOT EXISTS public."Order" (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    service_id uuid REFERENCES public."Service"(id) ON DELETE SET NULL,
    client_id uuid REFERENCES public."Users"(id) ON DELETE SET NULL,
    staff_id uuid REFERENCES public."Users"(id)  ON DELETE SET NULL,
    room_id uuid REFERENCES public."Room"(id) ON DELETE SET NULL,
    order_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()

);

-- ENABLE RLS POLICIES
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users can see relevant orders"
ON public."Order"
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


-- Assuming only Admins manage Orders
CREATE POLICY "Only admins can manage Orders"
ON public."Order"
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


-- Index For Searching Orders by Client base on Time
CREATE INDEX IF NOT EXISTS idx_reservation_time ON public."Reservation"(reservation_time);

-- Index For Searching Client Records
CREATE INDEX IF NOT EXISTS idx_order_client ON public."Order"(client_id);

-- ============================================================================
-- DONE!
-- INITIALIZED TABLES FOR THE SPA RESERVATION SYSTEM WITH RLS POLICIES
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================