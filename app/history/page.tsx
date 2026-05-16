"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Filter, History, SearchCheck, Trash2 } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { formatDateTime } from "@/lib/date";
import type { RiskLevel } from "@/lib/types";

type HistoryFilter = "all" | RiskLevel;

const filters: Array<{ label: string; value: HistoryFilter }> = [
  { label: "All", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" }
];

export default function HistoryPage() {
  const { history, hasLoaded, deleteAnalysis, clearHistory } = useAnalysisHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const filteredHistory = useMemo(() => {
    return filter === "all" ? history : history.filter((item) => item.level === filter);
  }, [filter, history]);

  const selected = filteredHistory.find((item) => item.id === selectedId) ?? filteredHistory[0] ?? null;

  useEffect(() => {
    if (filteredHistory[0] && !filteredHistory.some((item) => item.id === selectedId)) {
      setSelectedId(filteredHistory[0].id);
    }
  }, [filteredHistory, selectedId]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold text-tealguard">Local device history</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Analysis history</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Previous analyses are stored in LocalStorage on this browser. They are not uploaded anywhere.
            </p>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-bold text-red-800 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              <Trash2 aria-hidden="true" size={20} />
              Delete all
            </button>
          )}
        </div>
      </section>

      {!hasLoaded || history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No saved analyses"
          description="Analyze a suspicious message and the result will be saved here for later review."
          action={
            <Link
              href="/analyze"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-tealguard px-5 py-3 font-bold text-white focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <SearchCheck aria-hidden="true" size={20} />
              Analyze a message
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 pr-2 text-sm font-black text-ink">
                <Filter aria-hidden="true" size={18} />
                Filter
              </span>
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`min-h-10 rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-teal-200 ${
                    filter === item.value ? "bg-tealguard text-white" : "border border-teal-100 bg-white text-tealguard hover:bg-teal-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {filteredHistory.length === 0 ? (
              <EmptyState icon={History} title="No analyses match this filter" description="Choose another risk level or run a new analysis." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                      <th className="py-3 pr-4 font-bold">Date</th>
                      <th className="py-3 pr-4 font-bold">Message type</th>
                      <th className="py-3 pr-4 font-bold">Preview</th>
                      <th className="py-3 pr-4 font-bold">Score</th>
                      <th className="py-3 pr-4 font-bold">Risk</th>
                      <th className="py-3 pr-4 font-bold">Details</th>
                      <th className="py-3 pr-4 font-bold">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 align-top">
                        <td className="py-4 pr-4 text-sm text-slate-600">{formatDateTime(item.createdAt)}</td>
                        <td className="py-4 pr-4 font-semibold text-ink">{item.messageType}</td>
                        <td className="max-w-md py-4 pr-4 text-sm leading-6 text-slate-600">{item.preview}</td>
                        <td className="py-4 pr-4 font-black text-ink">{item.score}/100</td>
                        <td className="py-4 pr-4">
                          <RiskBadge level={item.level} compact />
                        </td>
                        <td className="py-4 pr-4">
                          <button
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-2 font-bold text-tealguard transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
                          >
                            <Eye aria-hidden="true" size={18} />
                            Details
                          </button>
                        </td>
                        <td className="py-4 pr-4">
                          <button
                            type="button"
                            onClick={() => deleteAnalysis(item.id)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-white text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                            aria-label="Delete analysis"
                          >
                            <Trash2 aria-hidden="true" size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-black text-ink">Selected analysis</h2>
            {selected && <AnalysisResult result={selected} />}
          </section>
        </div>
      )}
    </div>
  );
}
