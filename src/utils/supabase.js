import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_PUBLIC_API_KEY

if (!supabaseUrl || !supabaseKey) {
  // Helpful diagnostics in dev
  // eslint-disable-next-line no-console
  console.error('[Supabase] Missing env vars. Expected VITE_SUPABASE_PROJECT_URL and VITE_SUPABASE_ANON_PUBLIC_API_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
