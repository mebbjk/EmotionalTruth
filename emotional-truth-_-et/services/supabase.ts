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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
