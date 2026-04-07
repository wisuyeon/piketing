import { createClient } from '@supabase/supabase-js'

const isBrowser = typeof window !== 'undefined'
const supabaseUrl = isBrowser
  ? import.meta.env.VITE_SUPABASE_URL
  : process.env.VITE_SUPABASE_URL
const supabaseAnonKey = isBrowser
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)