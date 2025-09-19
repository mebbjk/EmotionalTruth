// Replaced Vite-specific `import.meta.env` types with a global `process.env` type definition.
// This aligns with the platform's method of injecting secrets and resolves the runtime error
// where `import.meta.env` was undefined. This manual definition avoids needing the full `@types/node` package.

// Fix: Resolved the "Cannot redeclare block-scoped variable 'process'" error
// by using namespace augmentation to add types to `process.env` instead of
// redeclaring the `process` variable. This is the standard TypeScript approach.
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
  }
}
