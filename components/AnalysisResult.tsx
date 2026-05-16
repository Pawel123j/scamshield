import { AlertTriangle, CheckCircle2, ListChecks, ShieldAlert } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { PDFExportButton } from "@/components/PDFExportButton";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { ScoringBreakdown } from "@/components/ScoringBreakdown";
import { buildAnalysisReportText } from "@/lib/pdf";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="space-y-6" aria-live="polite">
      <RiskScoreCard score={result.score} level={result.level} />

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert aria-hidden="true" className="mt-1 shrink-0 text-tealguard" size={24} />
            <div>
              <h2 className="text-2xl font-black text-ink">Analysis summary</h2>
              <p className="mt-2 text-lg font-bold leading-8 text-slate-700">{result.shortSummary}</p>
              <p className="mt-2 leading-7 text-slate-700">{result.detailedExplanation}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
                <span className="rounded-full bg-teal-50 px-3 py-1 text-tealguard">
                  Category: {result.dominantCategory.replace(/_/g, " ")}
                </span>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-800">
                  {result.confidence} confidence
                </span>
                {result.wasTruncated && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-900">Input was truncated for safety</span>
                )}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                The score is explainable: each warning sign contributes points, and contextual combinations can add
                extra weight. The final score is clamped to 100.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyButton text={buildAnalysisReportText(result)} label="Copy summary" variant="secondary" />
            <PDFExportButton result={result} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-ink">
          <AlertTriangle aria-hidden="true" className="text-honey" size={22} />
          Detected indicators
        </h2>
        {result.indicators.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {result.indicators.map((indicator) => (
              <article key={indicator.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-bold text-ink">{indicator.label}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink shadow-sm">
                    +{indicator.points}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">{indicator.description}</p>
                {indicator.matchedKeywords && indicator.matchedKeywords.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Match: {indicator.matchedKeywords.slice(0, 3).join(", ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">No common scam indicators were found in the provided text.</p>
        )}
      </section>

      <ScoringBreakdown items={result.scoringBreakdown} />

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-black text-ink">
          <ListChecks aria-hidden="true" className="text-tealguard" size={22} />
          What should I do now?
        </h2>
        <ol className="mt-4 space-y-3 text-slate-700">
          {result.nextSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tealguard text-sm font-black text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-black text-ink">
            <CheckCircle2 aria-hidden="true" className="text-tealguard" size={22} />
            Recommended actions
          </h2>
          <CopyButton text={result.recommendations.join("\n")} label="Copy recommendations" variant="secondary" />
        </div>
        <ul className="mt-4 space-y-3 text-slate-700">
          {result.recommendations.map((action) => (
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
