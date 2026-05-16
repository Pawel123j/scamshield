"use client";

import { useMemo, useState } from "react";
import { Database, Search } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ScamCard } from "@/components/ScamCard";
import { scamExamples } from "@/data/scams";

export default function ScamsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(scamExamples.map((scam) => scam.category)))];

  const filteredScams = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return scamExamples.filter((scam) => {
      const matchesCategory = category === "All" || scam.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [scam.title, scam.category, scam.howItWorks, scam.exampleMessage].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Scam database</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Common scam examples</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Browse realistic patterns: fake bank calls, delivery payments, BLIK requests, investment platforms, malware
          links and marketplace fraud.
        </p>
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-5 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="block">
            <span className="text-sm font-black text-ink">Search scams</span>
            <span className="mt-2 flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-tealguard focus-within:ring-4 focus-within:ring-teal-200">
              <Search aria-hidden="true" size={20} className="text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, category or example text"
                className="min-h-12 w-full border-0 bg-transparent outline-none"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-black text-ink">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filteredScams.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No scams match this search"
          description="Try a broader keyword such as BLIK, bank, paczka, inwestycja or karta."
        />
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {filteredScams.map((scam) => (
            <ScamCard key={scam.id} scam={scam} />
          ))}
        </section>
      )}
    </div>
  );
}
