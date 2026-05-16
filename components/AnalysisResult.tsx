import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";
import { RiskScoreCard } from "@/components/RiskScoreCard";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-6" aria-live="polite">
      <RiskScoreCard score={result.score} level={result.level} />

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <ShieldAlert aria-hidden="true" className="mt-1 text-tealguard" size={24} />
          <div>
            <h2 className="text-2xl font-black text-ink">Wynik analizy</h2>
            <p className="mt-2 text-slate-700">{result.summary}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{result.explanation}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-ink">
          <AlertTriangle aria-hidden="true" className="text-honey" size={22} />
          Wykryte sygnały
        </h2>
        {result.detectedIndicators.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {result.detectedIndicators.map((indicator) => (
              <article key={indicator.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-bold text-ink">{indicator.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{indicator.description}</p>
                {indicator.matchedTerms.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Dopasowanie: {indicator.matchedTerms.slice(0, 3).join(", ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">Nie znaleziono typowych sygnałów oszustwa w podanej treści.</p>
        )}
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-ink">
          <CheckCircle2 aria-hidden="true" className="text-tealguard" size={22} />
          Rekomendowane działania
        </h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          {result.recommendedActions.map((action) => (
            <li key={action} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-tealguard" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
