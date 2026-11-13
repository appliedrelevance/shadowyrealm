import type { ClefEnv } from "../lib/clef";
import type { ServiceEnv } from "../lib/sr-service";
import type { PagesEnv } from "./pages";

/**
 * Worker bindings and secrets.
 *
 * vars (wrangler.json):   SITE (a key of src/sites), AI_GATEWAY_NAME, SUPABASE_URL,
 *                         SUPABASE_ANON_KEY (public; the SPA ships it too)
 * secrets (wrangler secret put): MCP_API_KEY, SUPABASE_SERVICE_ROLE_KEY, OWNER_USER_ID
 * bindings: AI (Workers AI, for Clef), ASSETS
 */
export interface Env extends ServiceEnv, ClefEnv, PagesEnv {
  /** Bearer token for /mcp. Unset means the endpoint answers 503, never open. */
  MCP_API_KEY: string;
}

/**
 * The part of Cloudflare's ExecutionContext the Worker uses. Declared here because
 * @cloudflare/workers-types would clash with the DOM lib the SPA needs.
 */
export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
