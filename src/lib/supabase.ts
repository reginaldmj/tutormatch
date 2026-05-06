import { createClient } from '@supabase/supabase-js';

// Supabase project URL from your .env file.
// Example:
// EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

// Supabase public anon key from your .env file.
// This key is safe to use on the client because Supabase security
// is controlled through Row Level Security policies.
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Fail early if the Supabase URL is missing.
// This makes setup errors easier to understand.
if (!supabaseUrl) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL in .env');
}

// Fail early if the Supabase anon key is missing.
if (!supabaseAnonKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

// Shared Supabase client used throughout the app for:
// - authentication
// - database reads/writes
// - realtime subscriptions
export const supabase = createClient(supabaseUrl, supabaseAnonKey);