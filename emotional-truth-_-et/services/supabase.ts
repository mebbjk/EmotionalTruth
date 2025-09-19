// FIX: The triple-slash directive for Vite client types was causing a resolution error.
// This has been replaced with a global augmentation for the `ImportMeta` interface
// to correctly type `import.meta.env` for Vite environment variables.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
    }
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client.
// NOTE: For the application to connect to Supabase, you must provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
// The AppContext is currently configured to use mock data. To enable Supabase,
// you will need to implement the data fetching and mutation logic within AppContext.tsx.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
