import type { RiskLevel } from "@/lib/types";
import { RiskBadge } from "@/components/RiskBadge";
import { cn } from "@/lib/cn";

interface RiskScoreCardProps {
  score: number;
  level: RiskLevel;
}

function scoreColor(level: RiskLevel) {
  if (level === "Low") {
    return "bg-emerald-500";
  }
  if (level === "Medium") {
    return "bg-amber-500";
  }
  return "bg-red-500";
}

export function RiskScoreCard({ score, level }: RiskScoreCardProps) {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft" aria-label="Wynik ryzyka">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-tealguard">Risk score</p>
          <p className="mt-2 text-5xl font-black text-ink">{score}/100</p>
        </div>
        <RiskBadge level={level} />
      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div className={cn("h-full rounded-full transition-all", scoreColor(level))} style={{ width: `${score}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-xs font-semibold text-slate-500">
        <span>0</span>
        <span>30</span>
        <span>60</span>
        <span>100</span>
      </div>
    </section>
  );
}
