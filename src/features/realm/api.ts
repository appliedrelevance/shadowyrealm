/**
 * Reads for the timeline, the graph and the profile page. Every score comes
 * from the Worker (src/lib/sr-service.ts); the browser only draws it.
 */
import { useQuery } from "@tanstack/react-query";
import { useOperator } from "@/features/entities/hooks/useEntityMutations";
import { assertSameSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import type { getEntityProfile, getRealm } from "@/lib/sr-service";

export type Realm = Awaited<ReturnType<typeof getRealm>>;
export type RealmEntity = Realm["entities"][number];
export type RealmLink = Realm["links"][number];
export type EntityProfile = NonNullable<Awaited<ReturnType<typeof getEntityProfile>>>;

/**
 * GET with the session token when there is one; null on 404. The browser
 * revalidates every time, so it never shows scores older than the Worker's
 * one-minute edge cache, whatever lifetime the zone puts on the response.
 */
async function read<T>(path: string): Promise<T | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const response = await fetch(path, {
    cache: "no-cache",
    ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  });
  assertSameSite(response);
  if (response.status === 404) return null;
  const json = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(json.error ?? `GET ${path} failed: HTTP ${response.status}`);
  return json;
}

/** Everyone sees published entities; the owner also sees drafts. */
export function useRealm() {
  const { data: operator } = useOperator();
  return useQuery({
    queryKey: ["realm", !!operator],
    queryFn: async () => {
      const realm = await read<Realm>(operator ? "/api/realm?drafts=1" : "/api/realm");
      if (!realm) throw new Error("The realm endpoint is missing");
      return realm;
    },
    placeholderData: (previous) => previous,
  });
}

export function profileQuery(slug: string, operator: boolean) {
  return {
    queryKey: ["entity-profile", slug, operator],
    queryFn: () => read<EntityProfile>(`/api/entities/${encodeURIComponent(slug)}${operator ? "?drafts=1" : ""}`),
  };
}

export function useEntityProfile(slug: string | null) {
  const { data: operator } = useOperator();
  return useQuery({ ...profileQuery(slug ?? "", !!operator), enabled: !!slug });
}
