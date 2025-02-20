import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Default to a placeholder URL if environment variables are not set
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseAnonKey = 'placeholder-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  }
});
