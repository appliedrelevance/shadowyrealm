/**
 * ShadowyRealm CF Worker entry point.
 * /mcp serves the MCP control surface; /api/* serves the web UI's manual controls.
 * /sitemap.xml and /entity/* are written for crawlers and link previews.
 * All other routes serve the static SPA.
 */
import { handleApiRequest } from "./api";
import type { Env, ExecutionContext } from "./env";
import { handleMcpRequest } from "./mcp";
import { entityPage, sitemap } from "./pages";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return handleMcpRequest(request, env, ctx);
    }

    if (url.pathname.startsWith("/api/")) {
      const response = await handleApiRequest(request, env);
      if (response) return response;
      return Response.json({ error: "not found" }, { status: 404 });
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
