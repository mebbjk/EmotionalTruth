// Fix: Manually define types for import.meta.env.
// The default vite/client types were not being found, causing build errors.
// This ensures that TypeScript recognizes the `env` property on `import.meta`
// and the specific environment variables used in the application.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
