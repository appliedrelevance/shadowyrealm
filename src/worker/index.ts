/**
 * ShadowyRealm CF Worker entry point.
 * /mcp serves the MCP control surface; /api/* serves the web UI's handlers.
 * All other routes serve the static SPA.
 */
import { research } from "../lib/research";
import type { Env, ExecutionContext } from "./env";
import { handleMcpRequest } from "./mcp";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return handleMcpRequest(request, env, ctx);
    }

    // Superseded by the research_entity MCP tool; removed with the create form.
    if (url.pathname === "/api/ai/research" && request.method === "POST") {
      const { query, model } = (await request.json()) as { query: string; model?: string };
      if (!query) {
        return Response.json({ error: "query is required" }, { status: 400 });
      }
      return Response.json(await research(env, { query, model }));
    }

    // Serve SPA for all other routes
    return env.ASSETS.fetch(request);
  },
};
