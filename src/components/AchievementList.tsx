import { Trophy } from "lucide-react";

export function AchievementList({ achievements }: { achievements: string[] }) {
  if (achievements.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {achievements.map((a) => (
        <span
          key={a}
          className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
        >
          <Trophy className="h-3 w-3" />
          {a}
        </span>
      ))}
    </div>
  );
}
