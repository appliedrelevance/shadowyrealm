import { createFileRoute } from "@tanstack/react-router";
import { ComparisonView } from "@/features/comparison/components/ComparisonView";

export const Route = createFileRoute("/compare")({
  component: ComparisonView,
});
