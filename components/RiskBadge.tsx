import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/cn";
import { getRiskLabel, getRiskTone } from "@/lib/risk";

interface RiskBadgeProps {
  level: RiskLevel;
  compact?: boolean;
}

export function RiskBadge({ level, compact = false }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold",
        compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
        getRiskTone(level)
      )}
    >
      {getRiskLabel(level)}
    </span>
  );
}
