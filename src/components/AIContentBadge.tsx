import { Bot } from "lucide-react";

export function AIContentBadge({ model }: { model?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-arcane-blue/50 bg-arcane-blue/10 px-2 py-0.5 text-xs font-medium text-arcane-blue">
      <Bot className="h-3 w-3" />
      AI Generated{model ? ` (${model})` : ""}
    </span>
  );
}
