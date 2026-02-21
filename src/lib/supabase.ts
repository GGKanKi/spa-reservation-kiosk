// ==== CREATE CLIENT IMPORT ====
import { createClient } from "@supabase/supabase-js";


// ==== IMPORT ENVIRONMENT VARIABLES FOR DB CONNECTION ====
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_API_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Connection
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)