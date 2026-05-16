"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, History, SearchCheck, Trash2 } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { formatDateTime } from "@/lib/date";

export default function HistoryPage() {
  const { history, hasLoaded, deleteAnalysis, clearHistory } = useAnalysisHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = history.find((item) => item.id === selectedId) ?? history[0] ?? null;

  useEffect(() => {
    if (!selectedId && history[0]) {
      setSelectedId(history[0].id);
    }
  }, [history, selectedId]);

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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
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
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 align-top">
                      <td className="py-4 pr-4 text-sm text-slate-600">{formatDateTime(item.createdAt)}</td>
                      <td className="py-4 pr-4 font-semibold text-ink">{item.messageType}</td>
                      <td className="max-w-md py-4 pr-4 text-sm leading-6 text-slate-600">
                        {item.inputText.slice(0, 120)}
                        {item.inputText.length > 120 ? "..." : ""}
                      </td>
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
                          aria-label="Usuń analizę"
                        >
                          <Trash2 aria-hidden="true" size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-black text-ink">Latest details</h2>
            {selected && <AnalysisResult result={selected} />}
          </section>
        </div>
      )}
    </div>
  );
}
