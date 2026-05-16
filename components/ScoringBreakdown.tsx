import { Calculator } from "lucide-react";
import type { ScoringBreakdownItem } from "@/lib/types";

interface ScoringBreakdownProps {
  items: ScoringBreakdownItem[];
}

export function ScoringBreakdown({ items }: ScoringBreakdownProps) {
  return (
    <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
      <h2 className="flex items-center gap-2 text-xl font-black text-ink">
        <Calculator aria-hidden="true" className="text-tealguard" size={22} />
        Scoring breakdown
      </h2>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
            <span className="font-semibold text-slate-700">{item.label}</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-ink shadow-sm">
              +{item.points}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
