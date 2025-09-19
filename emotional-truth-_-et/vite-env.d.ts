// FIX: Removed `/// <reference types="vite/client" />`. It was causing a type resolution error.
// This project uses `process.env` with custom types defined below, not `import.meta.env`,
// so the "vite/client" types are not required.
/// <reference types="vite/client" />

// Since we are using Vite's `define` feature to expose environment variables on `process.env`,
// we need to add type definitions for it to avoid TypeScript errors during development.
// This tells TypeScript that `process.env` will exist and what properties it will have.
// FIX: To resolve "Cannot redeclare block-scoped variable 'process'", we augment the global
// NodeJS.ProcessEnv interface instead of declaring a new 'process' variable. This safely
// adds our environment variables to the existing type definition.
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
  }
}
