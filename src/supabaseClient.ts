import { createClient } from "@supabase/supabase-js";

// These should be provided via environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// (prefixed with VITE_ so Vite exposes them to the client).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
