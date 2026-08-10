import { Bot } from "lucide-react";

export function AIContentBadge({ model }: { model?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-info/50 bg-info/10 px-2 py-0.5 text-xs font-medium text-info">
      <Bot className="h-3 w-3" />
      AI Generated{model ? ` (${model})` : ""}
    </span>
  );
}
