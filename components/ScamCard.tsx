import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ScamExample } from "@/lib/types";
import { RiskBadge } from "@/components/RiskBadge";

interface ScamCardProps {
  scam: ScamExample;
}

export function ScamCard({ scam }: ScamCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-tealguard">{scam.category}</p>
          <h2 className="mt-2 text-xl font-black text-ink">{scam.title}</h2>
        </div>
        <RiskBadge level={scam.riskLevel} compact />
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{scam.howItWorks}</p>

      <div className="mt-5">
        <h3 className="flex items-center gap-2 font-bold text-ink">
          <AlertTriangle aria-hidden="true" size={19} className="text-honey" />
          Sygnały ostrzegawcze
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {scam.warningSigns.map((sign) => (
            <li key={sign} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-honey" />
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h3 className="flex items-center gap-2 font-bold text-ink">
          <CheckCircle2 aria-hidden="true" size={19} className="text-tealguard" />
          Co zrobić
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {scam.whatToDo.map((action) => (
            <li key={action} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-tealguard" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      <blockquote className="mt-6 rounded-2xl border-l-4 border-coral bg-red-50 p-4 text-sm leading-6 text-red-900">
        “{scam.exampleMessage}”
      </blockquote>
    </article>
  );
}
