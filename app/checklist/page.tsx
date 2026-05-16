"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import { ChecklistItem } from "@/components/ChecklistItem";
import { safetyChecklist } from "@/data/checklist";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storageKeys } from "@/lib/storage";

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(storageKeys.checklist, {});
  const completedCount = safetyChecklist.filter((item) => checkedItems[item.id]).length;
  const progress = Math.round((completedCount / safetyChecklist.length) * 100);

  const updateItem = (id: string, checked: boolean) => {
    setCheckedItems({ ...checkedItems, [id]: checked });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold text-tealguard">Daily safety habits</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Safety checklist</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Track the protective habits that reduce everyday scam risk. The checklist is stored locally in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCheckedItems({})}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
          >
            <RotateCcw aria-hidden="true" size={20} />
            Reset checklist
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
              <ShieldCheck aria-hidden="true" size={25} />
            </span>
            <div>
              <p className="text-sm font-bold text-tealguard">Progress</p>
              <p className="text-2xl font-black text-ink">
                {completedCount}/{safetyChecklist.length} complete
              </p>
            </div>
          </div>
          <p className="text-3xl font-black text-ink">{progress}%</p>
        </div>
        <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div className="h-full rounded-full bg-tealguard transition-all" style={{ width: `${progress}%` }} />
        </div>
        {completedCount === 0 && (
          <p className="mt-4 rounded-2xl bg-teal-50 p-4 text-sm font-semibold leading-6 text-tealguard">
            No checklist progress yet. Start with one habit, such as “I do not click suspicious links.”
          </p>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {safetyChecklist.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            checked={Boolean(checkedItems[item.id])}
            onChange={(checked) => updateItem(item.id, checked)}
          />
        ))}
      </section>
    </div>
  );
}
