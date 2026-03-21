import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import type { AuthContextValue } from "@/lib/auth";

interface RouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
