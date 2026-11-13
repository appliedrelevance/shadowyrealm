import { assertSameSite } from "./site";
import { supabase } from "./supabase";

/**
 * Calls the Worker's /api/* handlers with the signed-in user's Supabase access token.
 * The browser never writes to Supabase directly; the Worker decides who may.
 */
export async function operatorApi<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const init: RequestInit = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const response = await fetch(path, init);
  assertSameSite(response);

  const json = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(json.error ?? `${method} ${path} failed: HTTP ${response.status}`);
  return json;
}
