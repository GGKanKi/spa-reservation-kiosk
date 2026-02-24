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

-- ============================================================================
-- TO BE UPDATED FOR OTHER AUTH FUNCTIONS
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================