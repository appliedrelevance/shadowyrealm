import { createFileRoute } from "@tanstack/react-router";
import { EntityProfilePage } from "@/features/entities/components/EntityProfilePage";

export const Route = createFileRoute("/entity/$slug")({
  component: EntitySlugPage,
});

function EntitySlugPage() {
  const { slug } = Route.useParams();
  return <EntityProfilePage slug={slug} />;
}
