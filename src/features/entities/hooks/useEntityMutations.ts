import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { operatorApi } from "@/lib/operator-api";
import type { PublicationStatus } from "../types";

/** True when the signed-in account is the owner, who alone may use the manual controls. */
export function useOperator() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["operator", user?.id],
    enabled: !!user,
    queryFn: async () => (await operatorApi<{ operator: boolean }>("GET", "/api/session")).operator,
  });
}

export function useUpdateEntityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, newStatus }: { slug: string; newStatus: PublicationStatus }) =>
      operatorApi<{ slug: string; from: PublicationStatus; to: PublicationStatus }>(
        "POST",
        `/api/entities/${encodeURIComponent(slug)}/status`,
        { status: newStatus },
      ),
    onSuccess: ({ slug }) => {
      queryClient.invalidateQueries({ queryKey: ["entity-profile", slug] });
      queryClient.invalidateQueries({ queryKey: ["realm"] });
    },
  });
}
