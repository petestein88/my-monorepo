import { createClient } from '@supabase/supabase-js'

// Prefer environment variables (Netlify), fall back to the current hardcoded project
const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  'https://okyhcmxemffjhmbcmmbi.supabase.co'

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ??
  // Fallback only; set VITE_SUPABASE_ANON_KEY in Netlify for safety.
  'REPLACE_ME_IN_NETLIFY_ENV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export default supabase
