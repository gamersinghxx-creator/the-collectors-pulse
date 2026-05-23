import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create the client if env vars are present — prevents build-time crashes
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
} else {
  // Dummy client that won't crash at build time but will return empty data
  supabase = createClient('https://placeholder.supabase.co', 'placeholder', {
    auth: { persistSession: false },
  });
}

export { supabase };
