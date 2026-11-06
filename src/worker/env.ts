import type { ResearchEnv } from "../lib/research";
import type { ServiceEnv } from "../lib/sr-service";
import type { PagesEnv } from "./pages";

/**
 * Worker bindings and secrets.
 *
 * vars (wrangler.json):   AI_GATEWAY_NAME, SUPABASE_URL, SUPABASE_ANON_KEY (public; the SPA ships it too)
 * secrets (wrangler secret put): MCP_API_KEY, SUPABASE_SERVICE_ROLE_KEY,
 *                                OWNER_USER_ID, ANTHROPIC_API_KEY, OPENROUTER_API_KEY
 */
export interface Env extends ServiceEnv, ResearchEnv, PagesEnv {
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
