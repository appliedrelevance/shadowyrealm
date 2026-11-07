import { createFileRoute } from "@tanstack/react-router";
import { RealmHome } from "@/features/realm/RealmHome";

export const Route = createFileRoute("/")({
  component: RealmHome,
});
