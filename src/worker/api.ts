/**
 * HTTP handlers for the web UI's manual controls. Thin wrappers over the same
 * service functions the MCP tools call; only the owner account may write.
 */
import { ZodError } from "zod";
import * as schemas from "../lib/sr-schemas";
import * as service from "../lib/sr-service";
import type { Env } from "./env";

function bearer(request: Request): string {
  const auth = request.headers.get("Authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : "";
}

/** Returns null when the path is not an API route handled here. */
export async function handleApiRequest(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const token = bearer(request);

  // GET /api/session -> { operator } ; anyone may ask, only the owner gets true
  if (url.pathname === "/api/session" && request.method === "GET") {
    const operator = token ? await service.isOperator(env, token) : false;
    return Response.json({ operator });
  }

  // POST /api/entities/:slug/status  { status }
  const status = url.pathname.match(/^\/api\/entities\/([^/]+)\/status$/);
  if (status && request.method === "POST") {
    if (!token) return Response.json({ error: "sign in first" }, { status: 401 });
    if (!(await service.isOperator(env, token))) {
      return Response.json({ error: "only the owner can change an entity's status" }, { status: 403 });
    }
    try {
      const body = (await request.json()) as Record<string, unknown>;
      const input = schemas.setEntityStatusInput.parse({ ...body, slug: decodeURIComponent(status[1]) });
      return Response.json(await service.setEntityStatus(env, input));
    } catch (err) {
      if (err instanceof ZodError) {
        return Response.json({ error: err.issues.map((i) => i.message).join("; ") }, { status: 400 });
      }
      return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 });
    }
  }

  return null;
}
