/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The site this build serves: a key of src/sites, set by the Vite mode. */
  readonly VITE_SITE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
