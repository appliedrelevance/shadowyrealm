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

/** Drafts are included only when the owner asks for them. */
async function wantsDrafts(request: Request, env: Env, url: URL): Promise<boolean> {
  if (url.searchParams.get("drafts") !== "1") return false;
  const token = bearer(request);
  return token ? service.isOperator(env, token) : false;
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

  // GET /api/scores -> every published entity's score, largest first
  if (url.pathname === "/api/scores" && request.method === "GET") {
    return Response.json(await service.getScores(env, { include_drafts: false }));
  }

  // GET /api/realm[?drafts=1] -> curves and links for the timeline and the graph
  if (url.pathname === "/api/realm" && request.method === "GET") {
    return Response.json(await service.getRealm(env, await wantsDrafts(request, env, url)));
  }

  // GET /api/entities/:slug[?drafts=1] -> one entity's profile
  const profile = url.pathname.match(/^\/api\/entities\/([^/]+)$/);
  if (profile && request.method === "GET") {
    const found = await service.getEntityProfile(
      env,
      decodeURIComponent(profile[1]),
      await wantsDrafts(request, env, url),
    );
    return found ? Response.json(found) : Response.json({ error: "not found" }, { status: 404 });
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
