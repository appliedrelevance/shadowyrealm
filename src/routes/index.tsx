import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/features/entities/components/EntityListPage";

export const Route = createFileRoute("/")({
  component: EntityListPage,
});
