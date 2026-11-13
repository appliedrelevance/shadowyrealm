/**
 * When any /api read or write reaches a Worker serving another site, the whole
 * page is replaced by an error naming both (site-platform Requirement 4.9).
 */
import { useSyncExternalStore } from "react";
import { SiteMismatchError } from "./site";

let current: SiteMismatchError | null = null;
const listeners = new Set<() => void>();

export function reportIfMismatch(error: unknown): void {
  if (error instanceof SiteMismatchError && !current) {
    current = error;
    for (const l of listeners) l();
  }
}

export function useSiteMismatch(): SiteMismatchError | null {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => current,
  );
}
