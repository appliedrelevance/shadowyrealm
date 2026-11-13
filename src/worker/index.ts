/**
 * The Worker entry point, one deployment per site; SITE names the site.
 * /mcp serves the MCP control surface; /api/* serves the web UI's reads and manual controls.
 * /sitemap.xml and /entity/* are written for crawlers and link previews.
 * All other routes serve the static SPA built for the same site.
 */
import { SITES } from "../sites";
import { handleApiRequest } from "./api";
import type { Env, ExecutionContext } from "./env";
import { handleMcpRequest } from "./mcp";
import { entityPage, sitemap } from "./pages";

/** Reads anyone may make; their answers are the same for every visitor. */
const PUBLIC_READS = /^\/api\/(scores|realm|entities\/[^/]+)$/;
const PUBLIC_TTL_SECONDS = 60;

/**
 * Scores are recomputed from the whole dataset on every request, so a
 * visitor's read is cached at the edge for a minute. Signed-in requests and
 * the owner's drafts are never cached.
 */
async function cachedForVisitors(
  request: Request,
  ctx: ExecutionContext,
  compute: () => Promise<Response>,
): Promise<Response> {
  const url = new URL(request.url);
  const cacheable =
    request.method === "GET" &&
    PUBLIC_READS.test(url.pathname) &&
    !request.headers.has("Authorization") &&
    url.searchParams.get("drafts") !== "1";
  if (!cacheable) return compute();

  const cache = (caches as unknown as { default: Cache }).default;
  const hit = await cache.match(request);
  if (hit) return hit;
  const fresh = await compute();
  if (!fresh.ok) return fresh;
  const response = new Response(fresh.body, fresh);
  response.headers.set("Cache-Control", `public, max-age=${PUBLIC_TTL_SECONDS}`);
  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}

/** Every /api response names its site, so an SPA built for another site can refuse it. */
function withSite(response: Response, site: string): Response {
  const named = new Response(response.body, response);
  named.headers.set("X-Site", site);
  return named;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!env.SITE || !SITES[env.SITE]) {
      return Response.json(
        {
          error:
            `The Worker's SITE variable is ${env.SITE ? `"${env.SITE}", which names no site` : "unset"}; ` +
            `it must be one of ${Object.keys(SITES).join(", ")}`,
        },
        { status: 500 },
      );
    }
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return handleMcpRequest(request, env, ctx);
    }

    if (url.pathname.startsWith("/api/")) {
      return cachedForVisitors(request, ctx, async () => {
        try {
          const response = await handleApiRequest(request, env);
          return withSite(response ?? Response.json({ error: "not found" }, { status: 404 }), env.SITE);
        } catch (err) {
          return withSite(
            Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 }),
            env.SITE,
          );
        }
      });
    }

    if (url.pathname === "/sitemap.xml") {
      return sitemap(env);
    }

    const entity = url.pathname.match(/^\/entity\/([^/]+)\/?$/);
    if (entity && request.method === "GET") {
      return entityPage(request, env, decodeURIComponent(entity[1]));
    }

    // Serve SPA for all other routes
    return env.ASSETS.fetch(request);
  },
};
