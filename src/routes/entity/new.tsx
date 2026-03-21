import { createFileRoute, redirect } from "@tanstack/react-router";
import { EntityForm } from "@/features/entities/components/EntityForm";

export const Route = createFileRoute("/entity/new")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login", search: { redirect: "/entity/new" } });
    }
  },
  component: NewEntityPage,
});

function NewEntityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-text-bright">
        Summon Entity
      </h1>
      <p className="mt-2 text-text-muted">
        Bring forth a person, organization, or event for impact assessment.
      </p>
      <div className="mt-8">
        <EntityForm mode="create" />
      </div>
    </div>
  );
}
