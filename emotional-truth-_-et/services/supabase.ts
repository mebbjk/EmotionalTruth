// FIX: Added a triple-slash directive to include Vite's client types, which defines import.meta.env for TypeScript.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client.
// NOTE: For the application to connect to Supabase, you must provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
// The AppContext is currently configured to use mock data. To enable Supabase,
// you will need to implement the data fetching and mutation logic within AppContext.tsx.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);