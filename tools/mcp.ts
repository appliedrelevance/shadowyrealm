/**
 * The site's MCP server from a tool: JSON-RPC over HTTP with the operator's bearer key. Shared by the
 * loader (realm-load.ts) and the narrative writer (entity-narrative.ts).
 */
let rpcId = 0;

/** One JSON-RPC request; the answer is plain JSON or a single server-sent event. */
export async function mcpRequest<T>(url: string, key: string, method: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status} ${text.slice(0, 300)}`);
  const json = text.startsWith("{")
    ? JSON.parse(text)
    : JSON.parse(text.split("\n").find((l) => l.startsWith("data: "))!.slice(6));
  if (json.error) throw new Error(`${method}: ${json.error.message}`);
  return json.result as T;
}

/** Call one tool and parse its JSON answer; a tool error is thrown. */
export async function mcpCall<T = unknown>(url: string, key: string, name: string, input: Record<string, unknown>): Promise<T> {
  const result = await mcpRequest<{ content: { text: string }[]; isError?: boolean }>(url, key, "tools/call", {
    name,
    arguments: input,
  });
  const body = result.content[0].text;
  if (result.isError) throw new Error(`${name}: ${body}`);
  return JSON.parse(body) as T;
}
