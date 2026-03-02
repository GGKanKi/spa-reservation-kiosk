-- ============================================================================
-- CREATE USERS FROM SIGNUP AND ADD DATA TO USER AUTHENTICATION AND USER TABLES
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================


-- SIGN UP FOR USERS
CREATE OR REPLACE FUNCTION public.sign_up_user()
RETURNS TRIGGER AS $$ 
BEGIN
    INSERT INTO public."Users"(id, first_name, middle_name, last_name, email_add, phone_num, role)
    VALUES (
        new.id, -- This is now a UUID
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'middle_name',
        new.raw_user_meta_data->>'last_name',
        new.email,
        new.raw_user_meta_data->>'phone_num',
        COALESCE(new.raw_user_meta_data->>'role', 'member')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.sign_up_user();


-- ============================================================================
-- CREATE USERS FROM SIGNUP AND ADD DATA TO USER AUTHENTICATION AND USER TABLES
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================